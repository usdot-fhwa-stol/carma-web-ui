/***
* Create a unique namespace for each plugin widget to minimize collision of same name variables or functions.

TODO: Remove refrences to lanechange since it was used to temporarily unit test.
***/

CarmaJS.registerNamespace("CarmaJS.WidgetFramework.TrafficSignal");
//CarmaJS.registerNamespace("CarmaJS.WidgetFramework.LaneChange");

CarmaJS.WidgetFramework.TrafficSignal = (function () {
//CarmaJS.WidgetFramework.LaneChange = (function () {

        //*** Private Variables ***
        var t_traffic_signal_info = 'traffic_signal_info';
        var traffic_signal_max = 1;

        var svgLayerSpeed;
        var svgLayer1;
        var svgLayer2;
        var svgLayer3;

        //Listeners
        var listenerSpeedAccel;
        var listenerSFVelocity;

        // Implement max times for each phase to prevent display of erroneous data
        var GREEN_MAX = 60;
        var RED_MAX = 60;
        var YELLOW_MAX = 10;

        var prev_green_time = -1;
        var prev_yellow_time = -1;
        var prev_red_time = -1;

        var prev_phase = -1;
        var apply_decreasing_filter = true;
        var apply_max_limits = true;

        //*** Widget Install Folder ***
        //Currently the URL path from document or window are pointing to the page, not the actual folder location.
        //Therefore this needs to be hardcoded.
        //TODO: However, this could be set by widgetfw based on final install folder naming convention.
        var installfoldername = 'widgets/traffic_signal/';
        //var installfoldername = 'widgets/lane_change/';

        //*** Functions ***

        /***
        * Display the Speed Limit
        ***/
        var checkRouteState = function () {

            //Get Route State
            listenerRouteState = new ROSLIB.Topic({
                ros: ros,
                name: t_route_state,
                messageType: 'cav_msgs/RouteState'
            });

            listenerRouteState.subscribe(function (message) {

                if (svgLayerSpeed == null)
                    return;

                if (svgLayerSpeed.getElementById('svgLimitText') == null)
                    return;

                if (message.current_segment.waypoint.speed_limit != null && message.current_segment.waypoint.speed_limit != 'undefined')
                {
                    var speed_limit = String(message.current_segment.waypoint.speed_limit);

                    svgLayerSpeed.getElementById('svgLimitText').innerHTML = speed_limit.padStart(2,'0');
                }
            });
        };

        var filterGreenTime = function (remaining_time) {
            if (remaining_time > GREEN_MAX) {
                return GREEN_MAX;
            } else {
                return remaining_time;
            }
        };

        var filterRedTime = function (remaining_time) {
            if (remaining_time > RED_MAX) {
                return RED_MAX;
            } else {
                return remaining_time;
            }

        };

        var filterYellowTime = function (remaining_time) {
            if (remaining_time > YELLOW_MAX) {
                return YELLOW_MAX;
            } else {
                return remaining_time;
            }
        };

        var makeMonotonicallyDecreasing = function (prev_rem_time, remaining_time) {
            if (prev_rem_time < remaining_time) {
                return prev_rem_time;
            } else {
                return remaining_time;
            }
        };

        var filterGreenDecrease = function (remaining_time) {
            var filtered_green = -1;
            if (prev_green_time != -1) {
                filtered_green = makeMonotonicallyDecreasing(prev_green_time, remaining_time);
            } else {
                filtered_green = remaining_time;
            }

            prev_green_time = filtered_green;
            return filtered_green;
        };

        var filterRedDecrease = function (remaining_time) {
            var filtered_red = -1;
            if (prev_red_time != -1) {
                filtered_red = makeMonotonicallyDecreasing(prev_red_time, remaining_time);
            } else {
                filtered_red = remaining_time;
            }

            prev_red_time = filtered_red;
            return filtered_red;
        };

        var filterYellowDecrease = function (remaining_time) {
            var filtered_yellow = -1;
            if (prev_yellow_time != -1) {
                filtered_yellow = makeMonotonicallyDecreasing(prev_yellow_time, remaining_time);
            } else {
                filtered_yellow = remaining_time;
            }

            prev_yellow_time = filtered_yellow;
            return filtered_yellow;
        };

        var resetDecreasingFilter = function() {
            prev_green_time = -1;
            prev_red_time = -1;
            prev_yellow_time = -1;
        };

        var applyFilters = function(phase, remaining_time) {
            if (phase != prev_phase) {
                resetDecreasingFilter();
                prev_phase = phase;
            }

            switch (phase) {
                 case 1: //GREEN
                     //Bottom Signal - Green
                     if (apply_max_limits) {
                        remaining_time = filterGreenTime(remaining_time);
                     }
                     if (apply_decreasing_filter) {
                        remaining_time = filterGreenDecrease(remaining_time);
                     }
                     return remaining_time;
                     break;
                 case 2: //YELLOW
                     //Middle Signal - Yellow
                     if (apply_max_limits) {
                        remaining_time = filterYellowTime(remaining_time);
                     }
                     if (apply_decreasing_filter) {
                        remaining_time = filterYellowDecrease(remaining_time);
                     }
                     return remaining_time;
                     break;
                 case 3: //RED
                     //Top Signal - Red
                     if (apply_max_limits) {
                        remaining_time = filterRedTime(remaining_time);
                     }
                     if (apply_decreasing_filter) {
                        remaining_time = filterRedDecrease(remaining_time);
                     }
                     return remaining_time;
                     break;
                default: //not handled
                    console.log('Traffic Signal Info state is unknown: ' + item.state)
                    break;
            }
        };

        /***
        *    Display commanded speed
        ***/
        var showSpeedAccelInfo = function () {

            listenerSpeedAccel = new ROSLIB.Topic({
                ros: ros,
                name: t_cmd_speed,
                messageType: 'cav_msgs/SpeedAccel'
            });

            listenerSpeedAccel.subscribe(function (message) {

                if (svgLayerSpeed == null)
                    return;

                if (svgLayerSpeed.getElementById('svgCmdText') == null)
                    return;

                if (message.speed != null && message.speed != 'undefined')
                {
                    var speedCmd = String(Math.round(message.speed * METER_TO_MPH));

                    svgLayerSpeed.getElementById('svgCmdText').innerHTML = speedCmd.padStart(2,'0');
                }

            });
        };

        /*
            Display the actual speed
        */
        var showActualSpeed = function () {

            listenerSFVelocity = new ROSLIB.Topic({
                ros: ros,
                name: t_sensor_fusion_filtered_velocity,
                messageType: 'geometry_msgs/TwistStamped'
            });

            listenerSFVelocity.subscribe(function (message) {

                if (svgLayerSpeed == null)
                    return;

                if (svgLayerSpeed.getElementById('svgActualText') == null)
                    return;

                //If nothing on the Twist, skip
                if (message.twist == null || message.twist.linear == null || message.twist.linear.x == null) {
                    return;
                }

                var actualSpeedMPH = String(Math.round(message.twist.linear.x * METER_TO_MPH));
                svgLayerSpeed.getElementById('svgActualText').innerHTML = actualSpeedMPH.padStart(2,'0');
            });
        };

        /*
            Display the intersection info.

            UI expects the topic to be max of 3 records, and publish as needed, every update from start to finish.

            UI expects that the plugin will continually publish even when there's no signals being received. This
            way the signals get grayed out if there are no intersections discovered alogn the route, instead of being stuck
            on the last state.
        */
        var showTrafficSignalInfo = function () {

            listenerTrafficSignalInfoList = new ROSLIB.Topic({
                ros: ros,
                name: t_traffic_signal_info,
                messageType: 'cav_msgs/TrafficSignalInfoList'
            });

            listenerTrafficSignalInfoList.subscribe(function (message) {

                //If nothing on the list, exit
                if (message.traffic_signal_info_list == null || message.traffic_signal_info_list.length == 0) {
                    showEachTrafficSignal(null, svgLayer1); // Reset traffic lights when empty data is provided
                    showEachTrafficSignal(null, svgLayer2);
                    showEachTrafficSignal(null, svgLayer3);
                    return;
                }

                //message.traffic_signal_info_list.forEach(showEachTrafficSignal);

                //Loop thru to find the correct totaldistance
                for (i = 0; i < message.traffic_signal_info_list.length; i++)
                {
                    //console.log('message.traffic_signal_info_list.length: ' + message.traffic_signal_info_list.length);

                    if (i >= traffic_signal_max)
                        break; //exit if max reached

                    eval( 'showEachTrafficSignal(message.traffic_signal_info_list[i], svgLayer' + (i+1) + ');' );
                }

                //if signal is less than 3, need to gray out the remaining signals not used.
                for (x=message.traffic_signal_info_list.length-1; x < traffic_signal_max; x++ )
                {
                    eval( 'showEachTrafficSignal(message.traffic_signal_info_list[x], svgLayer' + (x+1) + ');' );
                }
            });
        };

        /*
            Show each traffic signal state and info.

            uint8 UNLIT=0
            uint8 GREEN=1
            uint8 YELLOW=2
            uint8 RED=3
            uint8 FLASHING_GREEN=4
            uint8 FLASHING_YELLOW=5
            uint8 FLASHING_RED=6
        */
        var showEachTrafficSignal = function (item, svgLayerForSignal) {

                if (svgLayerForSignal == null)
                {
                    //console.log ('showEachTrafficSignal() svgLayerForSignal is null');
                    return;
                }

                if (svgLayerForSignal.getElementById('svgCircleTopText') == null)
                {
                    //console.log ('showEachTrafficSignal() svgCircleTopText is null');
                    return;
                }

                //null from calling procedure means to turn off the signal or gray it out.
                if (item == null)
                {
                    //Commenting out since called out too much when signal is no longer used or grayed out. Will use only for testing.
                    //console.log ('showEachTrafficSignal() item is null');

                    //Clear info
                    svgLayerForSignal.getElementById('svgIntxHeaderText').innerHTML = 'INTERSECTION XXXX';
                    svgLayerForSignal.getElementById('svgDistanceText').innerHTML = 'XXX';
                    svgLayerForSignal.getElementById('svgLaneIdText').innerHTML = 'XXX';

                    //Gray out all
                    svgLayerForSignal.getElementById('svgCircleTopText').innerHTML = '';
                    svgLayerForSignal.getElementById('svgCircleTop').setAttribute('style', 'fill:url(#lgrd2-black-white);');
                    svgLayerForSignal.getElementById('svgCircleTopPath').setAttribute('style', 'fill:silver;');

                    svgLayerForSignal.getElementById('svgCircleMiddleText').innerHTML = '';
                    svgLayerForSignal.getElementById('svgCircleMiddle').setAttribute('style', 'fill:url(#lgrd2-black-white);');
                    svgLayerForSignal.getElementById('svgCircleMiddlePath').setAttribute('style', 'fill:silver;');

                    svgLayerForSignal.getElementById('svgCircleBottomText').innerHTML = '';
                    svgLayerForSignal.getElementById('svgCircleBottom').setAttribute('style', 'fill:url(#lgrd2-black-white);');
                    svgLayerForSignal.getElementById('svgCircleBottomPath').setAttribute('style', 'fill:silver;');

                    return;
                }

                //do not continue unless state exists
                if (item.state == null || item.state == 'undefined')
                {
                    console.log ('showEachTrafficSignal() item.state is null or undefined.');
                    return;
                }

                //Display the info.
                svgLayerForSignal.getElementById('svgIntxHeaderText').innerHTML = 'INTERSECTION ' + String(item.intersection_id).padStart(4,'0');
                svgLayerForSignal.getElementById('svgDistanceText').innerHTML = String(item.remaining_distance.toFixed(0)).padStart(3,'0');
                svgLayerForSignal.getElementById('svgLaneIdText').innerHTML = String(item.lane_id).padStart(3,'0');

               //Display the signal either on or off
               if (item.state != 0) //SIGNAL ON
               {
                    //Top Signal - Red
                    svgLayerForSignal.getElementById('svgCircleTopText').innerHTML = '';
                    svgLayerForSignal.getElementById('svgCircleTop').setAttribute('style', 'fill:#EF2E65;');
                    svgLayerForSignal.getElementById('svgCircleTopPath').setAttribute('style', 'fill:#CC0E57;');

                    //Middle Signal - Yellow
                    svgLayerForSignal.getElementById('svgCircleMiddleText').innerHTML = '';
                    svgLayerForSignal.getElementById('svgCircleMiddle').setAttribute('style', 'fill:#EDBF2F;');
                    svgLayerForSignal.getElementById('svgCircleMiddlePath').setAttribute('style', 'fill:#DBA81B;');

                    //Bottom Signal - Green
                    svgLayerForSignal.getElementById('svgCircleBottomText').innerHTML = '';
                    svgLayerForSignal.getElementById('svgCircleBottom').setAttribute('style', 'fill:#32D85D;');
                    svgLayerForSignal.getElementById('svgCircleBottomPath').setAttribute('style', 'fill:#19BF55;');
               }
               else //SIGNAL OFF
               {
                    //Gray out all
                    svgLayerForSignal.getElementById('svgCircleTopText').innerHTML = '';
                    svgLayerForSignal.getElementById('svgCircleTop').setAttribute('style', 'fill:url(#lgrd2-black-white);');
                    svgLayerForSignal.getElementById('svgCircleTopPath').setAttribute('style', 'fill:silver;');

                    svgLayerForSignal.getElementById('svgCircleMiddleText').innerHTML = '';
                    svgLayerForSignal.getElementById('svgCircleMiddle').setAttribute('style', 'fill:url(#lgrd2-black-white);');
                    svgLayerForSignal.getElementById('svgCircleMiddlePath').setAttribute('style', 'fill:silver;');

                    svgLayerForSignal.getElementById('svgCircleBottomText').innerHTML = '';
                    svgLayerForSignal.getElementById('svgCircleBottom').setAttribute('style', 'fill:url(#lgrd2-black-white);');
                    svgLayerForSignal.getElementById('svgCircleBottomPath').setAttribute('style', 'fill:silver;');
               }

               //Update the textbox for the remaining time based on the current state
               //Assumes only 2 digits for now.
               switch (item.state) {
                    case 0: //UNLIT
                        break;
                    case 1: //GREEN
                        //Bottom Signal - Green
                        svgLayerForSignal.getElementById('svgCircleBottomText').innerHTML = String(applyFilters(item.state, item.remaining_time)).padStart(2,'0');
                        break;
                    case 2: //YELLOW
                        //Middle Signal - Yellow
                        svgLayerForSignal.getElementById('svgCircleMiddleText').innerHTML = String(applyFilters(item.state, item.remaining_time)).padStart(2,'0');
                        break;
                    case 3: //RED
                        //Top Signal - Red
                        svgLayerForSignal.getElementById('svgCircleTopText').innerHTML = String(applyFilters(item.state, item.remaining_time)).padStart(2,'0');
                        break;
                    case 4: //FLASHING_GREEN
                        //NOT applicable at this time.
                        break;
                    case 5: //FLASHING_YELLOW
                        //NOT applicable at this time.
                        break;
                    case 6: //FLASHING_RED
                        //NOT applicable at this time.
                        break;
                    default: //not handled
                        console.log('Traffic Signal Info state is unknown: ' + item.state)
                        break;
                }

        };

        /***
        * Custom widgets using JQuery Widget Framework.
        * NOTE: that widget framework namespace can only be one level deep.
        ***/
        $.widget("CarmaJS.trafficSignalIntersection", {
           _create: function() {
                var myDiv = $("<object id='tsp_speed' type='image/svg+xml' data='" + installfoldername + "tsp_speed.svg' style='width: 270px; height: 490px;'></object>"
                          + "<object id='tsp_intx1' type='image/svg+xml' data='" + installfoldername + "tsp_signal_intx.svg' style='width: 270px; height: 490px;'></object>"
                          + "<object id='tsp_intx2' type='image/svg+xml' data='" + installfoldername + "tsp_signal_intx.svg' style='width: 270px; height: 490px;'></object>"
                          + "<object id='tsp_intx3' type='image/svg+xml' data='" + installfoldername + "tsp_signal_intx.svg' style='width: 270px; height: 490px;'></object>");

                $(this.element).append(myDiv);

                var tsp_speed = document.getElementById("tsp_speed");

                tsp_speed.addEventListener("load", function(){
                    var svgDocSpeed = tsp_speed.contentDocument;

                    svgLayerSpeed = svgDocSpeed.getElementById("svgLayerSpeed");

                     if (svgLayerSpeed != null) {
                            //Reset
                            svgLayerSpeed.getElementById("svgLimitText").innerHTML = "";
                            svgLayerSpeed.getElementById("svgCmdText").innerHTML = "";
                            svgLayerSpeed.getElementById("svgActualText").innerHTML = "";
                     }
                });

                var svgIntx1 = document.getElementById("tsp_intx1");
                var svgIntx2 = document.getElementById("tsp_intx2");
                var svgIntx3 = document.getElementById("tsp_intx3");

                svgIntx1.addEventListener("load", function () {

                    var svgDocIntx = svgIntx1.contentDocument;

                    svgLayer1 = svgDocIntx.getElementById("svgLayer");

                }); //svgIntx1.addEventListener

                svgIntx2.addEventListener("load", function () {

                    var svgDocIntx = svgIntx2.contentDocument;

                    svgLayer2 = svgDocIntx.getElementById("svgLayer");
                });

                svgIntx3.addEventListener("load", function () {

                    var svgDocIntx = svgIntx3.contentDocument;

                    svgLayer3 = svgDocIntx.getElementById("svgLayer");
                });

           },
           _destroy: function() {

                if (listenerRouteState)
                    listenerRouteState.unsubscribe();
                if (listenerSpeedAccel)
                    listenerSpeedAccel.unsubscribe();
                if (listenerSFVelocity)
                   listenerSFVelocity.unsubscribe();
                if (listenerTrafficSignalInfo)
                   listenerTrafficSignalInfo.unsubscribe();
                this.element.empty();
                this._super();
           },
           checkRouteState: function(){
              checkRouteState();
           },
           showSpeedAccelInfo: function(){
              showSpeedAccelInfo();
           },
           showActualSpeed: function(){
              showActualSpeed();
           },
           showTrafficSignalInfo: function(){
              showTrafficSignalInfo();
           }
        });

        /*** Public Functions ***
        This is the public function call to setup the different widgets available in this plugin.
        ***/
        var loadCustomWidget = function(container) {

            //Load the signal
            container.trafficSignalIntersection();
            container.trafficSignalIntersection("checkRouteState", null);
            container.trafficSignalIntersection("showSpeedAccelInfo", null);
            container.trafficSignalIntersection("showActualSpeed", null);
            container.trafficSignalIntersection("showTrafficSignalInfo", null);
        };

        //*** Public API  ***
        return {
            loadCustomWidget: loadCustomWidget
        };

})(); //CarmaJS.WidgetFramework.Cruising