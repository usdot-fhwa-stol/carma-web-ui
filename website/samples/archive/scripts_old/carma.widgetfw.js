CarmaJS.registerNamespace("CarmaJS.WidgetFramework");

CarmaJS.WidgetFramework = (function () {
        //Private variables

        //Private methods
        //Creating functions to prevent access by reference to private variables
        //Load javascript file references.
        //https://stackoverflow.com/questions/13121948/dynamically-add-script-tag-with-src-that-may-include-document-write
        //NOTE: appending to document.head doesn't seem to work, need to have this callback to fully load the script.
        //Can parse multiple files. e.g. scriptLoader(['a.js','b.js'], functionname)
        var scriptLoader = function (scripts, callback) {

            //In our scriptLoadHandler function we make sure that jQuery can be used with other libraries and also with other versions of itself.
           //jQuery = window.jQuery.noConflict(true);

            var count = scripts.length;

            function urlCallback(url) {
                return function () {
                    --count;
                    if (count < 1) {
                        callback();
                    }
                };
            }

            function loadScript(url) {

                var s = document.createElement('script');
                s.setAttribute('src', url);
                s.onload = urlCallback(url);
                document.head.appendChild(s);
            }

            for (var script of scripts) {
                loadScript(script);
            }
        };

        /*
           Removes the first matched array by key and value pair.
           Example Usage:
           var removed = removeByArrayKey(items, {
             key: 'id',
             value: 43
           });
        */
        var removeArrayByKey = function (array, params){
          array.some(function(item, index) {
            return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false;
          });

          return array;
        };

        //Get Plugin list
        var getPluginsActivated = function(){

               var pluginsActivated = sessionStorage.getItem('pluginsActivated');
               //alert('getPluginsActivated: pluginsActivated: ' + pluginsActivated); //Show all widgets in the array.

               if (pluginsActivated != 'undefined' && pluginsActivated != null && pluginsActivated != '') {
                     pluginsActivated = JSON.parse(pluginsActivated);
               }
               else{
                   pluginsActivated = [];
                   console.log ('getPluginsActivated: No plugins activated.');
               }

                pluginsActivated.sort(function(a, b) {
                  var nameA = a.id.toUpperCase(); // ignore upper and lowercase
                  var nameB = b.id.toUpperCase(); // ignore upper and lowercase
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }

                  // names must be equal
                  return 0;
                });

               return pluginsActivated;
        };

        var updateIsWidgetShownValue = function(id, newValue ){

              var pluginsActivated = getPluginsActivated();

              for (var i in pluginsActivated) {

                //alert('pluginsActivated[i].id: ' + pluginsActivated[i].id + '; widget.id: ' + widget.id);
                //if (pluginsActivated[i].id == widget.id.substring(2, widget.id.length)) {
                if (pluginsActivated[i].id == id.substring(2, id.length)) {
                   pluginsActivated[i].isWidgetShown = newValue;
                   //alert ('found!');
                   break; //Stop this loop, we found it!
                }
              }

               //Save changes back to session.
               sessionStorage.setItem('pluginsActivated', JSON.stringify(pluginsActivated));
        };
    
        /*
            Show list of widgets based on Plugins that have been activated.
        */
        var showWidgetOptions = function() {
            
            //Display the list of widgets
            var divWidgetOptions = document.getElementById('divWidgetOptions');
            divWidgetOptions.style.display = 'block';

            var divWidgetOptionsList = document.getElementById('divWidgetOptionsList');
            divWidgetOptionsList.innerHTML = '';

            var divWidgetArea = document.getElementById('divWidgetArea');
            divWidgetArea.style.display = 'none';

            //Loop thru and create checkboxes
            var pluginsActivated = getPluginsActivated();

            pluginsActivated.forEach(function (plugin) {
                var exists = checkboxExistsById(divWidgetOptionsList, plugin.id);
           
                var isPreviouslySelected = false;
                if (plugin.isWidgetShown == true ){
                    isPreviouslySelected = true;
                }

                console.log('showWidgetOptions: ' + plugin.id + ' : exists ' + exists + '; isPreviouslySelected: ' + isPreviouslySelected);

                //Create the checkbox based on the plugin properties.
                createCheckboxElement(divWidgetOptionsList, plugin.id, plugin.title, pluginsActivated.length, 'groupWidgets', isPreviouslySelected, false, 'CarmaJS.WidgetFramework.activateWidget');
                
            });

            var listWidgetOptionsFlag = sessionStorage.getItem('listWidgetOptionsFlag');
            console.log ('listWidgetOptionsFlag: ' + listWidgetOptionsFlag);

            if (listWidgetOptionsFlag == 'true' ) {

                var btn = document.createElement("BUTTON");        // Create a <button> element
                btn.title = 'Show Drivers View';
                btn.className = 'btnModal';
                btn.addEventListener("click", function () {CarmaJS.WidgetFramework.listWidgetOptions(false);});
                btn.innerText = 'Show Drivers View';
                divWidgetOptionsList.appendChild(btn);                    // Append <button> to <div> 
            }
        };


        /*
           Button on the Logs tab to show the user the widgets selection widgets once again that he/she wants to display.
           Sets the session variable;
           if value = false, means selection is made , reload widgets since it's been loaded once already.
        */
        var listWidgetOptions = function (value) {
            //Save the selection.
            sessionStorage.setItem('listWidgetOptionsFlag', value);
            console.log('listWidgetOptionsFlag: ' + value);

            //Save the options everytime.
            if (value == true )
                showWidgetOptions();
            else {
                if (countSelectedWidgets() > 0)
                    loadWidgets();
                else
                {
                    $("#divWidgetOptionsList").append("<span style='color:red;'> Please select a widget to continue.</span>");
                    return;
                }        
            }
             
            //Go to Driver's View
            openTab(event, 'divDriverView');
        };

        /*
            Capturing the activated plugins in a list for Widget options.
            pluginId is currently is the PluginName concatenated with _ and removing "Plugin" at the end.
        */
        var activatePlugin = function(id, title, value) {

                //alert('WidgetFramework.activateWidget - Plugin activated:' + id + '; value=' + value );
                //e.g. WidgetFramework.activateWidget - Plugin activated: cbNegotiation_Receiver_Plugin&1_0_0
                var pluginsActivated = getPluginsActivated();

                //Save the id and title for creating checkboxes.
                var cbId = id.replace('Plugin', 'Widget').substring(0,id.replace('Plugin', 'Widget').length);
                var cbTitle = title.substring(0, title.indexOf('Plugin') + 6).replace('Plugin', 'Widget');

                //Remove the plugin if de-selected.
                if (value == false)
                {
                     //Remove first if exists
                     var pluginsActivated = removeArrayByKey(pluginsActivated, {
                                                key: 'id',
                                                value: cbId
                                            });

                     //Save changes back to session.
                     sessionStorage.setItem('pluginsActivated', JSON.stringify(pluginsActivated));
                }
                else
                {
                     //Add the plugin when selected with namespace and folder path into the array for loading.
                     //Widget Namespace should come from the Plugin.name without "Plugin" at the end, and without spaces.
                     //e.g. "Speed Harmonization Plugin" widget namespace should be CarmaJS.WidgetFramework.SpeedHarmonization
                     //e.g. CarmaJS.WidgetFramework.RouteFollowing & CarmaJS.WidgetFramework.Cruising
                     var widgetNamespace = 'CarmaJS.WidgetFramework.' + id.substring(0, id.indexOf('Plugin')).replace('cb','').replace('_','');

                     //Widget install path should come from the Plugin.name without the "Plugin", and replacing the spaces with underscore(s).
                     //e.g. "Speed Harmonization Plugin" widget folder path should be speed_harmonization
                     //e.g. widgets/route_following
                     var widgetInstallPath = 'widgets/' + id.substring(0, id.indexOf('Plugin')).replace('cb','').toLowerCase();

                     var pluginItem = {id: cbId, title: cbTitle,  namespace: widgetNamespace, folderpath: widgetInstallPath, isWidgetShown: false};

                     //Check if results.
                     var result = $.grep(pluginsActivated, function(e){ return e.id == cbId; });

                     if (result.length == 0)
                     {
                         //Then add new one everytime Plugin is selected, since add or remove to another list for Widget selection.
                         pluginsActivated.push(pluginItem);
                         //Save and show
                         sessionStorage.setItem('pluginsActivated', JSON.stringify(pluginsActivated));

                     }
                }

                showWidgetOptions();
        };

        /*
            OnClick of the Widget Option
        */
        var activateWidget = function(id) {

            var cbWidgetOption = document.getElementById(id);
            if (cbWidgetOption == null) {
                console.log('activateWidget: cbWidgetOption is null');
            }
            else{
                var isChecked = cbWidgetOption.checked; // this is new value
                console.log('activateWidget: id: ' + id + '; isChecked2: ' + isChecked);

                //Update list
                updateIsWidgetShownValue(id, isChecked);
            }

            enableGuidance(); //rosbridge.js
        };

        /*
            Clear the widget area so it's a blank slate again.
        */
        var clearWidgetArea = function () {
            //Remove the divWidgetArea to call the destroy function on each widgets added to the area properly.
            $('#divWidgetArea').remove();

            //Then add it back in.
            var myDiv = "<div id='divWidgetArea'></div>";
            $('#divDriverView').append(myDiv);
        };

        /*
            Based on selected widgets, this loads the widgets onto the Driver View.
        */
        var loadWidgets = function(){

           //Get plugin list
           var pluginsActivated = getPluginsActivated();

           //Check if results.
           var result = $.grep(pluginsActivated, function(e){ return e.isWidgetShown == true; });

            if (result.length == 0) {
              // No widgets shown, show OptionsList
              return;
            }
            //else {
              // multiple items found
              console.log(result.length + ' widgets to load');
            //}

          //Hide the list of widgets
          var divWidgetOptions = document.getElementById('divWidgetOptions');
          divWidgetOptions.style.display = 'none';

          //NOTE: Since activation/reactivation and widget options changes, need to keep wiping out the divWidgetArea.
          clearWidgetArea();

            //Loop thru the active widgets and load each css, js and call it's loadCustomWidget().
            //Check if at least one of the expected file exists.
            //namespace: widgetNamespace, folderpath: widgetInstallPath};
            result.forEach(function (plugin) {

                //alert('plugin.id: ' + plugin.id + '; plugin.title: ' + plugin.title + '; plugin.isWidgetShown: ' + plugin.isWidgetShown );

                if (plugin.isWidgetShown == false)
                    return;

                var widgetNamespace = plugin.namespace;
                var widgetInstallPath = plugin.folderpath;

                if (widgetNamespace== null || widgetInstallPath == null)
                {
                    console.log('Widget namespace or install path is null.');
                    return;
                }

                var cssFilePath = widgetInstallPath + '/widget.css';
                var jsFilePath = widgetInstallPath + '/widget.js';

                $.ajax({
                     url: jsFilePath,
                     type:'HEAD',
                     error: function()
                     {
                         //file not exists
                         //TODO: In chrome, even with statusCode or error handling, the HTTP 404 (Failed to Load) error still shows separately
                         console.log('loadWidgets: Widget file does NOT exist: ' + jsFilePath );
                         return false;
                     },
                     success: function()
                     {
                        console.log('cssFilePath: ' + cssFilePath);
                        //1) Load css
                        var link = document.createElement('link');
                        link.setAttribute('rel', 'stylesheet');
                        link.setAttribute('type', 'text/css');
                        link.setAttribute('href', cssFilePath);
                        document.getElementsByTagName('head')[0].appendChild(link);

                        //2) Load JS
                        console.log('jsFilePath1: ' + jsFilePath);
                        scriptLoader([jsFilePath],function()
                        {
                             // now you can use the code from loaded script files.
                             eval(widgetNamespace + '.loadCustomWidget($("#divWidgetArea"));');
                        });

                        return true;
                     }
                });
            });
        };

        /*
            Return the number of  selected widgets.
        */
        var countSelectedWidgets = function(){

            //Get plugin list
            var pluginsActivated = getPluginsActivated();

            //Check if results.
            var result = $.grep(pluginsActivated, function(e){ return e.isWidgetShown == true; });

            if (result == null || result == 'undefined' || result == '')
                return 0;

            console.log('countSelectedWidgets: ' + result.length);
            return result.length;

        };

        var closeWidgets = function () {

            clearWidgetArea();

            //Clear session variables
            sessionStorage.removeItem('pluginsActivated');
            sessionStorage.removeItem('listWidgetOptionsFlag');

            //Then add it back in.
            var  myDiv = "<div id='divWidgetArea'></div>";
            $('#divDriverView').append(myDiv);
        };
    
        var onRefresh = function () {

            if (isGuidance.active == true)
                sessionStorage.setItem('listWidgetOptionsFlag', true);

            var listWidgetOptionsFlag = sessionStorage.getItem('listWidgetOptionsFlag');

            if (listWidgetOptionsFlag == 'true') {
                CarmaJS.WidgetFramework.showWidgetOptions();
                return;
            }

            CarmaJS.WidgetFramework.loadWidgets();

        };

        //Public API
        return {
            showWidgetOptions: showWidgetOptions,
            listWidgetOptions: listWidgetOptions,
            countSelectedWidgets: countSelectedWidgets,
            loadWidgets: loadWidgets,
            activatePlugin: activatePlugin,
            activateWidget: activateWidget,
            closeWidgets: closeWidgets,
            onRefresh: onRefresh
        };
})();
