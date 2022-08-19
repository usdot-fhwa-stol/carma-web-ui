//gobal constant variables
const GREEN_COLOR = 'rgb(167, 223, 57)';
const PURPLE_COLOR = 'rgb(153, 0, 153)';
const BLUE_COLOR = 'rgb(0, 255, 255)';
const RED_COLOR = 'rgb(255, 51, 51)';
const SIGNAL_RED = 'red';
const SIGNAL_GREEN = 'green';
const SIGNAL_YELLOW = 'yellow';
const SIGNAL_FLASHING_GREEN = 'flash_green';
const SIGNAL_FLASHING_YELLOW = 'flash_yellow';
const SIGNAL_FLASHING_RED = 'flash_red';
const UNKNOWN = 0;
const UNKNOWN_LABEL = 'unknown';
const STRATEGIC = 1;
const STRATEGIC_LABEL ='strategic';
const TACTICAL = 2;
const TACTICAL_LABEL = 'tactical';
const CONTROL = 3;
const CONTROL_LABEL = 'control';
const WIFI = 'wifi';
const BLUETOOTH = 'bluetooth';
const CELLULAR = 'cellular';
const NONE = 'none';
const DEG2RAD = 0.0174533;

//ROS Topci names
const T_GUIDANCE_STATE = '/guidance/state';
const T_SYSTEM_ALERT = '/system_alert';
const T_COMMS_INBOUND_BINARY_MSG = '/hardware_interface/comms/inbound_binary_msg';
const T_COMMS_OUTBOUND_BINARY_MSG='/hardware_interface/comms/outbound_binary_msg';
const T_DRIVER_DISCOVERY = '/hardware_interface/driver_discovery';
const T_ROUTE_STATE = '/guidance/route_state';
const T_ROUTE_EVENT = '/guidance/route_event';
const T_ROUTE = '/guidance/route';
const T_ABBR_ROUTE_STATE = '/guidance/route_state'; 
const T_ROBOTIC_STATUS = 'controller/robotic_status';
const T_INCOMING_BSM = '/message/incoming_bsm';
const T_NAV_SAT_FIX = '/hardware_interface/gnss/fix_raw';//'nav_sat_fix';
const T_CMD_SPEED = 'controller/vehicle_cmd';
const T_ACC_ENGAGED = 'can/acc_engaged';
const T_DIAGNOSTICS  = '/diagnostics';
const T_CAN_ENGINE_SPEED  = 'can/engine_speed';
const T_CAN_SPEED = 'can/speed';
const T_SENSOR_FUSION_FILTERED_VELOCITY = '/hardware_interface/gnss/vel_raw';//velocity'; TODO: Need verification //hardware_interface/vehicle/twist
const T_CONTROLLING_PLUGINS = 'plugins/controlling_plugins';
const T_LATERAL_CONTROL_DRIVER = '';
const T_TRAFFIC_SIGNAL_INFO = '/traffic_signal_info';
const T_VEHICLE_CMD = '/hardware_interface/vehicle_cmd';
const T_EKF_TWIST = '/localization/ekf_twist';
const T_LIGHT_BAR_STATUS = '/hardware_interface/lightbar/light_bar_status';
const T_CARMA_SYSTEM_VERSION = "/carma_system_version";
const T_GEOFENCE_INFO = "/environment/active_geofence";
const T_LANE_CHANGE = '/guidance/upcoming_lane_change_status';
const T_PLATOON_INFO = '/guidance/platooning_info';
const T_LOCALIZATION_STATUS = '/localization/localization_status';
const T_STEERING_WHEEL="/hardware_interface/steering_wheel";
const T_SPEED_PEDALS ="/hardware_interface/speed_pedals";
const T_GPS_NODELET_WRAPPER='/hardware_interface/novatel_gps_nodelet_wrapper';
const T_STEERING_WHEEL_FEEDBACK = "/hardware_interface/steering_feedback";
const T_THROTTLE_FEEDBACK = "/hardware_interface/throttle_feedback";
const T_BRAKE_FEEDBACK = "/hardware_interface/brake_feedback";
const T_LANE_CHANGE_STATUS = "/guidance/cooperative_lane_change_status";
const T_TCR_BOUNDING_POINTS = "/environment/tcr_bounding_points";
const T_GNSS_FIX_FUSED="/hardware_interface/gnss_fix_fused";
const T_J2735_SPAT="/message/incoming_j2735_spat";
const T_INTERSECTION_SIGNAL_GROUP_IDS="/environment/intersection_signal_group_ids";
const T_UI_INSTRUCTION ="/ui/ui_instructions";

//ROS Services names
const S_GUIDANCE_AVAILABLE_ROUTES = '/guidance/get_available_routes';
const S_GUIDANCE_REGISTERED_PLUGINS = '/guidance/plugins/get_registered_plugins';
const S_GUIDANCE_ACTIVE_PLUGINS = '/guidance/plugins/get_active_plugins';
const S_GUIDANCE_ACTIVATED = '/guidance/set_guidance_active';
const S_ACTIVATE_PLUGINS = '/guidance/plugins/activate_plugin';
const S_ACTIVATE_ROUTE = '/guidance/set_active_route';
const S_START_ACTIVE_ROUTE = 'start_active_route';
const S_ABORT_ACTIVE_ROUTE="/guidance/abort_active_route";

//ROS msgs names
const M_GUIDANCE_STATE = 'carma_planning_msgs/msg/GuidanceState';
const M_GUIDANCE_AVAILABLE_ROUTES = 'carma_planning_msgs/srv/GetAvailableRoutes';
const M_GUIDANCE_PLUGINLIST = 'carma_planning_msgs/srv/PluginList';
const M_CAV_BYTEARRAY = 'carma_driver_msgs/msg/ByteArray';
const M_DRIVER_STATUS = 'carma_driver_msgs/msg/DriverStatus';
const M_GUIDANCE_ACTIVATE = 'carma_planning_msgs/srv/SetGuidanceActive';
const M_PLUGIN_ACTIVATION = 'carma_planning_msgs/srv/PluginActivation';
const M_ROUTE_STATE = 'carma_planning_msgs/msg/RouteState';
const M_ACTIVE_ROUTE = 'carma_planning_msgs/srv/SetActiveRoute';
const M_ABORT_ACTIVE_ROUTE_REQ="carma_planning_msgs/srv/AbortActiveRoute";
const M_ROUTE_EVENT = 'carma_planning_msgs/msg/RouteEvent';
const M_START_ACTIVE_ROUTE = 'carma_planning_msgs/srv/StartActiveRoute';
const M_ROUTE = 'carma_planning_msgs/msg/Route';
const M_SYSTEM_ALERT = 'carma_msgs/msg/SystemAlert';
const M_ROBOT_ENABLED = 'carma_planning_msgs/msg/RobotEnabled';
const M_BSM = 'carma_v2x_msgs/msg/BSM';
const M_NAV_SAT_FIX = 'sensor_msgs/msg/NavSatFix';
const M_SPEED_ACCL = 'carma_driver_msgs/msg/SpeedAccel';
const M_BOOL = 'std_msgs/msg/Bool';
const M_DIAGNOSTIC_ARRAY = 'diagnostic_msgs/msg/DiagnosticArray';
const M_FLOAT64 = 'std_msgs/msg/Float64';
const M_TWIST__COVARIANCE_STAMPED  = 'geometry_msgs/msg/TwistWithCovarianceStamped';
const M_ACTIVE_MANEUVERS = 'carma_planning_msgs/msg/ActiveManeuvers';
const M_LATERAL_CONTROL = 'carma_driver_msgs/msg/LateralControl';
const M_TRAFFIC_SIGNAL_INFO_LIST = 'carma_perception_msgs/msg/TrafficSignalInfoList';
const M_VEHICLE_CMD = 'autoware_msgs/msg/VehicleCmd';
const M_TWIST_STAMPED = 'geometry_msgs/msg/TwistStamped';
const M_LIGHT_BAR_STATUS = 'carma_driver_msgs/msg/LightBarStatus';
const M_GEOFENCE_INFO_MSG = 'carma_perception_msgs/msg/CheckActiveGeofence';
const M_LANE_CHANGE = 'carma_planning_msgs/msg/UpcomingLaneChangeStatus';
const M_PLATOON_INFO = 'carma_planning_msgs/msg/PlatooningInfo';
const M_LOCALIZATION_REPORT = 'carma_localization_msgs/msg/LocalizationStatusReport';
const M_STEERING_WHEEL="automotive_platform_msgs/msg/SteerWheel";
const M_SPEED_PEDALS="automotive_platform_msgs/msg/SpeedPedals";
const M_THROTTLE_FEEDBACK="automotive_platform_msgs/msg/ThrottleFeedback";
const M_STEERING_FEEDBACK="automotive_platform_msgs/msg/SteeringFeedback";
const M_BRAKE_FEEDBACK="automotive_platform_msgs/msg/BrakeFeedback";
const M_LANE_CHANGE_STATUS = "carma_planning_msgs/msg/LaneChangeStatus";
const M_TCR_POLYGON = "carma_v2x_msgs/msg/TrafficControlRequestPolygon"
const M_GPS_COMMON_GPSFIX="gps_msgs/msg/GPSFix";
const M_J2735_SPAT="j2735_v2x_msgs/msg/SPAT";
const M_MULTI_ARRAY="std_msgs/msg/Int32MultiArray";

//ROS param names
const P_REQUIRED_PLUGINS = '/guidance/health_monitor/required_plugins';

// m/s to MPH
const METER_TO_MPH = 2.23694;
const METER_TO_MILE = 0.000621371;

//Guidance CAV_Messages
const STARTUP = 1;
const DRIVERS_READY = 2;
const ACTIVE = 3;
const ENGAGED = 4;
const INACTIVE = 5;
const SHUTDOWN = 0;

//Signal State
const SIGNAL_UNLIT_STATE=0;
const SIGNAL_GREEN_STATE=1;
const SIGNAL_YELLOW_STATE=2;
const SIGNAL_RED_STATE=3;
const SIGNAL_FLASHING_GREEN_STATE=4;
const SIGNAL_FLASHING_YELLOW_STATE=5;
const SIGNAL_FLASHING_RED_STATE=6;
const MAX_LOG_LINES = 10;

//Signal state from J2735
const TRAFFIC_SIGNAL_PHASE_STATE={
    unavailable: 0,
    dark: 1,
    stop_then_proceed: 2, //flashing red
    stop_and_remain: 3,    //red light
    pre_movement: 4, // red+yellow
    permissive_movement_allowed: 5, // permissive green
    protected_movement_allowed: 6, // protected green
    permissive_clearance: 7, // permissive yellow
    protected_clearance: 8, // protected yellow
    caution_conflicting_traffic: 9 //flashing yellow
}

//system alert types
const SYSTEM_ALERT_CAUTION = 1;
const SYSTEM_ALERT_WARNING = 2;
const SYSTEM_ALERT_FATAL = 3;
const SYSTEM_ALERT_NOT_READY = 4;
const SYSTEM_ALERT_DRIVERS_READY = 5;
const SYSTEM_ALERT_SHUTDOWN = 6;

//PinPoint GPS status and DRIVER STATUS
const GPS_DRIVER_STATUS_OFF = 0;
const GPS_DRIVER_STATUS_OPERATIONAL = 1;
const GPS_DRIVER_STATUS_DEGRADED = 2;
const GPS_DRIVER_STATUS_FAULT = 3;

//LightBar status
const LIGHT_BAR_ON = 1;
const LIGHT_BAR_OFF = 0;

//Localization Status
const LOCALIZATION_STATUS_UNINITIALIZED = 0; //Gray
const LOCALIZATION_STATUS_INITIALIZING = 1; //Gray
const LOCALIZATION_STATUS_OPERATIONAL = 2; //Green
const LOCALIZATION_STATUS_DEGRADED = 3; //Yellow
const LOCALIZATION_STATUS_DEGRADED_NO_LIDAR_FIX = 4; //Orange
const LOCALIZATION_STATUS_AWAIT_MANUAL_INITIALIZATION = 5; //Grey

//Platooning info
const  PLATOONING_STATE_DISABLED = 0;
const  PLATOONING_STATE_SEARCHING = 1;
const  PLATOONING_STATE_CONNECTING_TO_NEW_FOLLOWER = 2;
const  PLATOONING_STATE_CONNECTING_TO_NEW_LEADER = 3;
const  PLATOONING_STATE_LEADING = 4;
const  PLATOONING_STATE_FOLLOWING = 5;

const  PLATOONING_STATE_DISABLED_LABEL = 'DISABLED';
const  PLATOONING_STATE_SEARCHING_LABEL = 'SEARCHING';
const  PLATOONING_STATE_CONNECTING_TO_NEW_FOLLOWER_LABEL = 'CONNECTING TO NEW FOLLOWER';
const  PLATOONING_STATE_CONNECTING_TO_NEW_LEADER_LABEL = 'CONNECTING TO NEW LEADER';
const  PLATOONING_STATE_LEADING_LABEL = 'LEADING';
const  PLATOONING_STATE_FOLLOWING_LABEL = 'FOLLOWING';

//Geogence type
const GEOFENCE_TYPE_SPEED_LIMIT = 1;

//Lane Change Direction
const LANE_CHANGE_DIRECTION_TO_LEFT = 1;
const LANE_CHANGE_DIRECTION_TO_RIGHT = 2;
const LANE_CHANGE_DIRECTION_STAY_IN_LANE = 0;

//ROS
var g_ros = new ROSLIB.Ros();

//global page variables
var g_retry_counter=0;
var g_required_plugins = '';
var g_acceleratorCircle = null;
var g_brakeCircle = null;
var g_timer = null; //elapsed timer
var g_ready_counter = 0;
var g_IsDisplayShownUponFirstEngaged = false;
var isModalPopupShowing = false;
var sound_counter=0;
var sound_counter_max=0;

//map 
var map;
var bounds;
var markers=[];
var hostmarker;
var map_frame = null;  //map iframe 
var map_content_window = null; //map iframe content window
var map_doc = null;
var tcr_polygon = null;
const g_polygon_type = {
    TCR: "TCR"
}


var p_host_instructions = '/saxton_cav/ui/host_instructions';

var t_light_bar_status = 'control/light_bar_status'; //02/2019: added to display lightbar on UI


var g_sound_counter = 0;
var g_sound_counter_max = 3; //max # of times the sounds will be repeated.
var g_sound_played_once = false; //For ROUTE_COMPLETE, LEFT_ROUTE, FATAL & SHUTDOWN
var g_sound_guidance_played_once = false; //For INACTIVE
var g_sound_msgPop_played_once = false; //For Warning and Caution; Separate this from the ROUTE_COMPLETE, LEFT_ROUTE, and INACTIVE in case these events happens at same time
var g_play_audio_error = false; //No Error

//session variables
var session_isGuidance = null;
var session_selectedRoute = null;
var session_isSystemAlert = null;


