var unknown_intersection_id = -1; //Integer (0...65535)
var unknown_signal_group = 0; //Integer (0...255). The value 0 shall be used when the ID is not available or not known.
var intersection_signal_group_ids = [unknown_intersection_id,unknown_signal_group];

function UpdateIntersectionAndSignalGroupIds(){
    listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_INTERSECTION_SIGNAL_GROUP_IDS,
        messageType: M_MULTI_ARRAY
    });
    listener.subscribe(function(message){
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected())
        {
            return;
        };

        intersection_signal_group_ids[0] = message.data[0];
        intersection_signal_group_ids[1] = message.data[1];
    });
}

UpdateIntersectionAndSignalGroupIds();

function TrafficSignalInfoList(){

    listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_J2735_SPAT,
        messageType: M_J2735_SPAT
    });

    listener_sim_clock = new ROSLIB.Topic({
        ros: g_ros,
        name: T_SIM_CLOCK,
        messageType: M_ROS_CLOCK
    });

    // Variables to track simulation vs real clock
    let use_sim_clock = false;
    let sim_clock_time = null;
    let last_real_time = Date.now();
    let latest_msg_process_real_time = Date.now();
    let latest_msg_process_sim_time = null;
    // Subscribe to simulation clock
    listener_sim_clock.subscribe(function(message) {
        if (!IsROSBridgeConnected()) {
            return;
        }

        // If we receive sim clock data, use it
        if (message && message.clock) {
            // nsec is somehow not undefined, but we don't need it
            const nsec = message.clock.nsec !== undefined ? Number(message.clock.nsec) : 0;
            use_sim_clock = true;
            // Convert ROS time (seconds and nanoseconds) to milliseconds
            sim_clock_time = message.clock.sec * 1000 + Math.floor(nsec) / 1000000;
            last_real_time = Date.now();
        } else {
            console.log("[WARN] Sim clock message received but invalid format");
        }
    });

    listener.subscribe(function (message) {
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected()) {
            return;
        };

        try {
            if(message!=undefined && message.intersections != undefined && Array.isArray(message.intersections.intersection_state_list)){
                message.intersections.intersection_state_list.forEach(element=>{
                    //Checking intersection id
                    if(element.id.id != unknown_intersection_id && element.id.id == intersection_signal_group_ids[0]) {
                        element.states.movement_list.forEach(inner_ele=>{
                            //Checking signal group id
                            if(inner_ele.signal_group != unknown_signal_group && inner_ele.signal_group == intersection_signal_group_ids[1]) {
                                inner_ele.state_time_speed.movement_event_list.every(event_ele=>{
                                    // update latest message process time
                                    latest_msg_process_real_time = Date.now();
                                    latest_msg_process_sim_time = sim_clock_time;
                                    let signal_state = event_ele.event_state.movement_phase_state;
                                    let current_phase_max_sec = getCurPhaseMaxSecBySpatTiming(
                                        element.moy,
                                        event_ele.timing.min_end_time,
                                        use_sim_clock,
                                        sim_clock_time
                                    );

                                    // Ensure we have a valid number
                                    if (isNaN(current_phase_max_sec) || current_phase_max_sec === null) {
                                        console.error("[ERROR] Invalid countdown value (NaN) - using default");
                                        current_phase_max_sec = 30; // Default fallback value
                                    }

                                    //Prevent repeating the same state
                                    switch(signal_state) {
                                        case TRAFFIC_SIGNAL_PHASE_STATE.protected_movement_allowed:
                                            $('.traffic-signal-col').html(updateTrafficSignal('green',current_phase_max_sec));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.stop_and_remain:
                                            $('.traffic-signal-col').html(updateTrafficSignal('red',current_phase_max_sec));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.protected_clearance:
                                            $('.traffic-signal-col').html(updateTrafficSignal('yellow',current_phase_max_sec));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.permissive_movement_allowed:
                                            $('.traffic-signal-col').html(updateTrafficSignal('flash_green',current_phase_max_sec));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.permissive_clearance:
                                        case TRAFFIC_SIGNAL_PHASE_STATE.caution_conflicting_traffic:
                                            $('.traffic-signal-col').html(updateTrafficSignal('flash_yellow',current_phase_max_sec));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.stop_then_proceed:
                                            $('.traffic-signal-col').html(updateTrafficSignal('flash_red',current_phase_max_sec));
                                            break;
                                        default:
                                            $('.traffic-signal-col').html(updateTrafficSignal('',''));
                                            console.error("Traffic signal state is invalid");
                                            break;
                                    }
                                    return false;
                                });
                            }
                        });
                    }
                });
            }
        } catch(error) {
            console.error(error);
        }

        // Create only one interval to avoid memory leaks
        if (!window.signalIntervalCreated) {
            window.signalIntervalCreated = true;
            setInterval(function() {
                let elapsed_time;

                // Use sim clock for timing if available
                if (use_sim_clock && sim_clock_time !== null) {
                    // Calculate elapsed time in simulation
                    elapsed_time = sim_clock_time - latest_msg_process_sim_time;

                } else {
                    // Fall back to real clock
                    elapsed_time = Date.now() - latest_msg_process_real_time;
                }

                if (elapsed_time >= 1000) {
                    $('.traffic-signal-col').html(updateTrafficSignal('',''));
                    signalState = null;
                }
            }, 1000);
        }
    });
}

/****
 * @brief Given the timing from the icoming spat message, and return the count down for traffic signal phase change
 * @param Input moy (unit of min): Min of current UTC year.
 *              min_end_time (unit of 1/10 sec): Timing data in UTC time stamps for event. Include min end times of phase confidentce and estimated next occurrence
 *              use_sim_clock: Boolean indicating whether to use simulation clock
 *              sim_clock_time: Current simulation time in milliseconds (if available)
 * @returns current_phase_max_sec: The traffic signal will change phase in number of seconds.
 */
function getCurPhaseMaxSecBySpatTiming(moy, min_end_time, use_sim_clock = false, sim_clock_time = null) {

    // Check for invalid inputs that could cause NaN
    if (moy === undefined || moy === null || isNaN(moy)) {
        console.error("[ERROR] Invalid moy value:", moy);
        return 30; // Default fallback
    }

    if (min_end_time === undefined || min_end_time === null || isNaN(min_end_time)) {
        console.error("[ERROR] Invalid min_end_time value:", min_end_time);
        return 30; // Default fallback
    }

    let current_phase_max_sec = 0;

    //get current year
    let current_date;
    let now = Date.now();

    if (use_sim_clock && sim_clock_time !== null && !isNaN(sim_clock_time)) {
        // Use simulation time
        current_date = new Date(sim_clock_time);
    } else {
        // Use real time
        current_date = new Date(now);
    }

    let current_year = current_date.getUTCFullYear();

    let current_date_utc = new Date(Date.UTC(
        current_date.getUTCFullYear(),
        current_date.getUTCMonth(),
        current_date.getUTCDate(),
        current_date.getUTCHours(),
        current_date.getUTCMinutes(),
        current_date.getUTCSeconds(),
        current_date.getUTCMilliseconds()
    ));

    //get current months, days, hours of the year based on moy (in mins)
    //An integer between 0 (January) and 11 (December) representing the month.
    //An integer between 1 and 31 representing the day of the month.
    //An integer between 0 and 23 representing the hours.
    //An integer between 0 and 59 representing the minutes.
    //An integer between 0 and 59 representing the seconds.
    let current_year_start = new Date(Date.UTC(current_year, 0, 1, 0, 0, 0, 0));

    // Convert moy to a number to ensure math operations work correctly
    let moy_number = Number(moy);
    let current_year_add_moy = new Date(current_year_start.getTime() + moy_number * 60 * 1000);
    let current_year_month_day_hour = new Date(Date.UTC(
        current_year_add_moy.getUTCFullYear(),
        current_year_add_moy.getUTCMonth(),
        current_year_add_moy.getUTCDate(),
        current_year_add_moy.getUTCHours(),
        0, 0, 0
    ));

    // Convert min_end_time to a number to ensure math operations work correctly
    let min_end_time_number = Number(min_end_time);
    //get current time in terms of seconds, minutes, hours, day, and year
    let current_year_add_moy_add_min_end_time = new Date(current_year_month_day_hour.getTime() + min_end_time_number * 100);

    // Calculate difference and ensure we get a valid number
    let time_diff = current_year_add_moy_add_min_end_time.getTime() - current_date_utc.getTime();

    if (isNaN(time_diff)) {
        console.error("[ERROR] Time difference calculation resulted in NaN");
        return 30; // Default fallback
    }

    current_phase_max_sec = time_diff / 1000;

    if (current_phase_max_sec < 0) {
        console.error("[ERROR] Signal timing is expired:", current_phase_max_sec);
        return 0; // Return 0 for expired timing
    }

    let result = Math.max(0, Math.floor(current_phase_max_sec));
    return result;
}
