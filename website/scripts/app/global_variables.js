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
const UNKNOWN_LABEL = 'unknow';
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
var g_is_guidance_automated = false;
var g_is_rosridge_connected = false;

//ROS Topci names
const T_GUIDANCE_STATE = '/guidance/state';

//ROS Services names
const S_GUIDANCE_AVAILABLE_ROUTES = '/guidance/get_available_routes';
const S_GUIDANCE_REGISTERED_PLUGINS='/guidance/plugins/get_registered_plugins';
const S_GUIDANCE_ACTIVE_PLUGINS='/guidance/plugins/get_active_plugins';

//ROS msgs names
const M_GUIDANCE_STATE = 'cav_msgs/GuidanceState';
const M_GUIDANCE_AVAILABLE_ROUTES = 'cav_srvs/GetAvailableRoutes';
const M_GUIDANCE_PLUGINLIST ='cav_srvs/PluginList';

//ROS param names
const P_REQUIRED_PLUGINS = '/guidance/health_monitor/required_plugins';

//CAV_Messages
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

//ROS
var g_ros = new ROSLIB.Ros();

//
var g_retry_counter=0;
var g_required_plugins = '';
var g_acceleratorCircle = null;
var g_brakeCircle = null;
