
var inputs=[], components=[], input_labels=[], component_labels=[],
    connections=[], J=[], Nu=[], U=[], UMF=[], UPC=[], W=[], zoom=1, startX,
    startY, dX, dY, mousedown=false;

var datasets=[], sources=[], data_str, ds_valid=false, ds_edit, src_edit,
    inp_edit=-1, comp_edit=-1, ds_nom=-1, ds_rand=-1, src_sys=[], ds_del=-1,
    src_del=-1, inp_del=-1, comp_del=-1;

var flags={info:false, before:false, after:false, cor:false, J:false, Nu:false,
    U:false, UMF:false, UPC:false, W:false};

var r=Raphael("holder", "100%", "100%");

var viewbox=[0, 0, $("#holder").width(), $("#holder").height()];

r.setViewBox(0, 0, $("#holder").width(), $("#holder").height());







var ds_dialog=$("#ds_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_ds_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    Ok: function(){
      ds_dialog.dialog("close");
    }
  },
  close: empty_ds_dialog
});

var src_dialog=$("#src_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_src_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    Ok: function(){
      src_dialog.dialog("close");
    }
  },
  close: empty_src_dialog
});

var inp_dialog=$("#inp_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_inp_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    Ok: function(){
      inp_dialog.dialog("close");
    }
  },
  close: empty_inp_dialog
});

var comp_dialog=$("#comp_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',

  open: build_comp_dialog,

  buttons: {

    Ok: function(){
      comp_dialog.dialog("close");
    }
  },
  close: empty_comp_dialog
});



var add_ds_dialog=$("#add_ds_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_ds_dialog on dialog open, build_add_ds_dialog() found
  // in custom.js
  open: build_add_ds_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Dataset button to dialog with function action
    "Add Dataset": function(){
      // Define warning array (warn), warning string (warn_str), warning
      // count (ws), and counter (i)
      var warn=[], warn_str, ws, i;
      // Grab dataset name from dialog
      var name=$("#add_ds_name").val().trim();
      // Check if dataset name exists
      if(name.length<=0){warn.push("name");}
      // check if dataset data is not valid
      if(!ds_valid){warn.push("data");}
      // Check if any warnings were not thrown
      if(warn.length==0){
        datasets.push({name: name, values: ds_str_2_arr(data_str)});
        data_str="";
        ds_valid=false;
        ds_dialog.dialog("close");
        $("#Datasets").click();
        add_ds_dialog.dialog("close");
      } else {
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the dataset is not valid.";
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      add_ds_dialog.dialog("close");
    }
  },
  close: empty_add_ds_dialog
});

var add_src_dialog=$("#add_src_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_ds_dialog on dialog open, build_add_ds_dialog() found
  // in custom.js
  open: build_add_src_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Dataset button to dialog with function action
    "Add Source": function(){
      // Define warning array (warn), warning string (warn_str), warning
      // count (ws), and counter (i)
      var warn=[], warn_str, ws, i;

      var num_regex=/^[0-9][.0-9]*$/;
      // Grab dataset name from dialog
      var name=$("#add_src_name").val().trim();

      var value=$("#add_src_value").val().trim();
      // Check if dataset name exists
      if(name.length<=0){warn.push("name");}
      // check if dataset data is not valid
      if ((value.length<=0) || !(num_regex.test(value))){warn.push("value");}
      // Check if any warnings were not thrown
      if(warn.length==0){
        sources.push({name: name, value: Number(value)});
        src_dialog.dialog("close");
        $("#Sources").click();
        add_src_dialog.dialog("close");
      } else {
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the source is not valid.";
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      add_src_dialog.dialog("close");
    }
  },
  close: empty_add_src_dialog
});

var add_inp_dialog=$("#add_inp_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_add_inp_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    "Add Input": function(){
      // Define warning array (warn), warning string (warn_str), warning
      // count (ws), and counter (i)
      var warn=[], warn_str, ws, i;
      // Define variable regex
      var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
      // Define nominal value regex
      var nom_regex=/^[0-9][.0-9]*$/;
      // Grab input name from dialog
      var name=$("#add_inp_name").val().trim();
      // Grab input variable from dialog
      var variable=$("#add_inp_variable").val().trim();
      // Grab input label from dialog
      var label=$("#add_inp_label").val().trim();
      // Grab input nominal value from dialog
      var nominal=$("#add_inp_nominal").val().trim();
      // Grab input random uncertainty value from dialog
      var random=$("#add_inp_random").val().trim();
      // Check if input name exists
      if (name.length<=0){warn.push("name");}
      // Check if input variable exists and is correct form
      if ((variable.length<=0) || !variable_regex.test(variable)){warn.push("variable");}
      // Check if input label exists
      if (label.length<=0){warn.push("label");}
      // Check if input nominal value exists and is correct form
      if ((nominal.length<=0) || !(nom_regex.test(nominal))){warn.push("nominal value");}
      // Check if input random uncertainty exists and is correct form
      if ((random.length<=0) || !(nom_regex.test(random))){warn.push("random uncertainty");}
      // Check if any warnings were not thrown
      if (warn.length==0){
        // Check if input variable is valid
        if(valid_variable(inputs, components, variable)){
          // Define input object height and width
          var hw=$("#holder").width(), hh=$("#holder").height(), ow=50, oh=50;
          // Get input label size
          var os=get_text_size(label);
          // If input label width is greater than default object width, resize
          if(os[0]>ow){ow=Math.round(os[0])+10;}
          // If input label height is greater than default object height, resize
          if(os[1]>oh){oh=Math.round(os[1])+10;}
          // If object width is greater than object height, set object height to
          // object width
          if(ow>oh){oh=ow;}
          // Else set object width to object height
          else {ow=oh;}
          // Add object to canvas
          r.addobj({type:"ellipse", x:hw/2-ow/2, y:hh/2-oh/2, w:ow, h:oh, name:name, variable:variable, label:label, nominal:nominal, nom_ds:ds_nom, random:random, rand_ds:ds_rand, sys_src:src_sys});
          // Calculate the nominal values of components, calc_comp_nom() found in
          // customs.js
          calc_comp_nom();
          // Clear add input dialog input name field
          $("#add_inp_name").val("");
          // Clear add input dialog input variable field
          $("#add_inp_variable").val("");
          // Clear add input dialog input label field
          $("#add_inp_label").val("");
          // Clear add input dialog input nominal value field
          $("#add_inp_nominal").val("");
          // Clear add input dialog input random uncertainty value field
          $("#add_inp_random").val("");
          // Clear add input dialog input systematic uncertainty value field
          $("#add_inp_systematic").val("");
          // Set Jacobian flag to false
          flags.J=false;
          // Set W matrix flag to false
          flags.W=false;
          // Set NU matrix flag to false
          flags.NU=false;
          // Set U matrix flag to false
          flags.U=false;

          $("#u_sum").remove();
          flags.UMF=false;
          $("#umf_sum").remove();
          flags.UPC=false;
          $("#upc_sum").remove();
          add_inp_dialog.dialog("close");
          inp_dialog.dialog("close");
          ds_nom=-1;
          ds_rand=-1;
          src_sys=[];
          $("#Inputs").click();
        } else {
          $("body").append("<div id='warn' class='dialog' title='Warning'><p>Input variable must be unique.</p></div>");
          $(function(){
            $("#warn").dialog({
              modal: true,
              buttons: {
                Ok: function(){
                  $(this).dialog("close");
                  $("#warn").remove();
                }
              }
            })
          })
        }
      } else {
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the input is not valid.";
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      ds_nom=-1;
      ds_rand=-1;
      src_sys=[];
      add_inp_dialog.dialog("close");
    }
  },
  close: empty_add_inp_dialog
});

var add_comp_dialog=$("#add_comp_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',

  open: build_add_comp_dialog,

  buttons: {
    "Add Component": function(){
      // Declare function variables:
      // warn - array of warnings
      // warn_str - string of warning message
      // ws - number of warnings
      // i - variable counter
      var warn=[], warn_str, ws, i;
      // Regular expression to check for valid variable
      var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
      // Grab name value from dialog
      var name=$("#add_comp_name").val().trim();
      // Grab variable value from dialog
      var variable=$("#add_comp_variable").val().trim();
      // Grab label value from dialog
      var label=$("#add_comp_label").val().trim();
      // Grab function value from dialog
      var fun=$("#add_comp_fun").val().trim();
      // Check if name value is valid, add warning if it is not
      if (name.length<=0){warn.push("name");}
      // Check if variable value is valid, add warning if it is not
      if (variable.length<=0 || !variable_regex.test(variable)){
        warn.push("variable");
      }
      // check if label value is valid, add warning if it is not
      if (label.length<=0){warn.push("label");}
      // check if function value is valid, add warning if it is not
      if (fun.length<=0 || get_dep(fun).length==0){warn.push("function");}
      // if there are no warnings
      if (warn.length==0){
        // check if variable name is unique, valid_variable() found in custom.js
        if(valid_variable(inputs, components, variable)){
          // get all dependent variables in component funtions
          var dep_var=get_dep(fun);
          // get all input variables
          var inp_var=get_inp_var();
          // get all component variables
          var comp_var=get_comp_var();
          // get number of dependent variables from component function
          var dvs=dep_var.length;
          // get number of input variables
          var ivs=inp_var.length;
          // get number of component variables
          var cvs=comp_var.length;
          // psuedo-boolean counter to count variable name conflicts
          var var_boolean=0;
          // if there are input variables
          if(inp_var){
            // loop through each dependent variable from component function
            for(i=0; i<dvs; i++){
              // if dependent variable is in input variable array or if
              // dependent variable in in component variable array
              if($.inArray(dep_var[i],inp_var)==-1 &&
                 $.inArray(dep_var[i],comp_var)==-1){
                // add to psuedo-boolean counter
                var_boolean+=1;
              }
            }
            // if there are no variable name conflicts
            if(var_boolean==0){
              // get the number of components
              var cs=components.length
              // get the Raphaeljs paper width and height
              // declare objects minimum widht and height
              var hw=$("#holder").width(), hh=$("#holder").height(),
                  ow=50, oh=50;
              // get the size of label, get_text_size() found in custom.js
              // return array of width and height
              var os=get_text_size(label);
              // if text width is larger than minimum width then resize
              // object width
              if(os[0]>ow){ow=Math.round(os[0])+10;}
              // if text height is larger than minimum height then resize
              // object height
              if(os[1]>oh){oh=Math.round(os[1])+10;}
              // if object width is larger than height, go with width
              if(ow>oh){oh=ow;}
              // if object height is larger than width, go with height
              else {ow=oh;}
              // add Raphaeljs object, addobj() found in custom.js
              r.addobj({type:"rect", x:hw/2-ow/2, y:hh/2-oh/2, w:ow, h:oh,
                        name:name, variable:variable, label:label, fun:fun});
              // loop through all inputs
              for(i=0; i<ivs; i++){
                // if dependent variables in input variables
                if($.inArray(inp_var[i],dep_var)!=-1){
                  // add Raphaeljs connection, addcon() found in custom.js
                  r.addcon(inputs[i],components[cs]);
                }
              }
              // Loop through all components
              for(i=0; i<cvs; i++){
                // if dependent variables in component variables
                if($.inArray(comp_var[i],dep_var)!=-1){
                  // add Raphaeljs connection, addcon() found in custom.js
                  r.addcon(components[i],components[cs]);
                }
              }
              // calc_comp_nom() found in custom.js
              calc_comp_nom();
              // Clear dialog component name value
              $("#add_com_name").val("");
              // Clear dialog component variable value
              $("#add_comp_variable").val("");
              // Clear dialog component label value
              $("#add_com_label").val("");
              // Clear dialog component function value
              $("#add_com_fun").val("");
              // Set J for recalculation
              flags.J=false;
              // Set W for recalculation
              flags.W=false;
              // Set U for recalculation
              flags.U=false;
              // Remove total uncertainty summary from menu
              $("#u_sum").remove();
              // Set UMF for recalculation
              flags.UMF=false;
              // Remove uncertainty magnification factor summary from menu
              $("#umf_sum").remove();
              // Set UPC for recalculation
              flags.UPC=false;
              // Remove uncertainty percent contribution summary from menu
              $("#upc_sum").remove();
              // Close the dialog
              add_comp_dialog.dialog("close");
              comp_dialog.dialog("close");
              $("#Components").click();
            // if there are variable name conflicts
            } else {
              // Add warning element to html document
              $("body").append("<div id='warn' class='dialog' title='Warning'>\
                                <p>The function contains input(s) that have not\
                                been added yet. Would you like to add the input\
                                now?</p></div>");
              // Create warning dialog on the fly
              $(function(){
                // Set warning dialog
                $("#warn").dialog({
                  // set modal property so dialog will be able to move
                  modal: true,
                  // define buttons on dialog
                  buttons: {
                    // Show Add Input button on warning dialog
                    "Add Input": function(){
                      // Close the warning dialog
                      $(this).dialog("close");
                      // Close the add component dialog
                      add_comp_dialog.dialog("close");
                      // Open the add input dialog
                      add_inp_dialog.dialog("open");
                      // Remove the warning elements from the html document
                      $("#warn").remove();
                    },
                    // Show Ok button on warning dialog
                    Ok: function(){
                      // Close the warning dialog
                      $(this).dialog("close");
                      // Remove the warning element from the html document
                      $("#warn").remove();
                    }
                  }
                })
              })
            }
          // If there are not inputs
          } else {
            // Add warning element to html document
            $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
                              No inputs have been added yet.</p></div>");
            // Create warning dialog on the fly
            $(function(){
              // Set warning dialog
              $("#warn").dialog({
                // set modal property so dialog will be able to move
                modal: true,
                // define buttons on dialog
                buttons: {
                  // Show Add Input button on warning dialog
                  "Add Input": function(){
                    // Close the warning dialog
                    $(this).dialog("close");
                    // Close the add component dialog
                    add_comp_dialog.dialog("close");
                    // Open the add input dialog
                    add_inp_dialog.dialog("open");
                    // Remove the warning elements from the html document
                    $("#warn").remove();
                  },
                  // Show Ok button on warning dialog
                  Ok: function(){
                    // Close the warning dialog
                    $(this).dialog("close");
                    // Remove the warning elements from the html document
                    $("#warn").remove();
                  }
                }
              })
            })
          }
        // If component variable is not unique
        } else {
          // Add warning elemnt to html document
          $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
                            Component variable must be unique.</p></div>");
          // Create warning dialog on the fly
          $(function(){
            // Set warning dialog
            $("#warn").dialog({
              // set modal property so dialog will be able to move
              modal: true,
              // define buttons on dialog
              buttons: {
                // Show Ok button on warning dialog
                Ok: function(){
                  // Close the warning dialog
                  $(this).dialog("close");
                  // Remove the warning elements from the html document
                  $("#warn").remove();
                }
              }
            })
          })
        }
      // If there is a warning message from add component form
      } else {
        // get the number of warning messages
        ws=warn.length;
        // Start to build the warning string
        warn_str="The ";
        // If there is only one warning message
        if(ws==1){
          // Continue to build warning string
          warn_str+=warn[0];
        // If there are more than one warning messages
        } else{
          // Continue to build warning string
          warn_str+=warn[0];
          // Loop through all warning messages
          for(i=1; i<ws-1; i++){
            // Continue to build warning string
            warn_str+=", "+warn[i];
          }
          // Continue to build warning string
          warn_str+=", and "+warn[ws-1];
        }
        // Continue to build warning string
        warn_str+=" of the component is not valid.";
        // Add warning element to html document
        $("body").append("<div id='warn' class='dialog' title='Fields Required'\
                          ><p>"+warn_str+"</p></div>");
        // Create warning dialog on the fly
        $(function(){
          // Set warning dialog
          $("#warn").dialog({
            // set modal property so dialog will be able to move
            modal: true,
            // define buttons on dialog
            buttons: {
              // Show Ok button on waring dialog
              Ok: function(){
                // Close the warning dialog
                $(this).dialog("close");
                // Remove the warning elements from the html document
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    // Add cancel to the add component dialog
    Cancel: function(){
      // Close the add component dialog
      add_comp_dialog.dialog("close");
    }
  },
  close: empty_add_comp_dialog
});



var edit_ds_dialog=$("#edit_ds_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_ds_dialog on dialog open, build_add_ds_dialog() found
  // in custom.js
  open: build_edit_ds_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Dataset button to dialog with function action
    "Edit Dataset": function(){
      // Define warning array (warn), warning string (warn_str), warning
      // count (ws), and counter (i)
      var warn=[], warn_str, ws, i;
      // Grab dataset name from dialog
      var name=$("#edit_ds_name").val().trim();
      // Check if dataset name exists
      if(name.length<=0){warn.push("name");}
      // check if dataset data is not valid
      if(!ds_valid){warn.push("data");}
      // Check if any warnings were not thrown
      if(warn.length==0){
        var i, ni, di, dep=[], mess="";
        ni=inputs.length;
        for(i=0; i<ni; i++){
          if(ds_edit==inputs[i].data("nom_ds") || ds_edit==inputs[i].data("rand_ds")){
            dep.push(i);
          }
        }
        if(dep.length>0){
          di=dep.length;
          mess="This will modify value for input";
          if(di==1){
            mess=mess+" "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+").";
          } else {
            mess=mess+"s ";
            for(i=0; i<di-1; i++){
              mess=mess+(dep[i]+1)+", ";
            }
            mess=mess+"and "+(dep[di-1]+1)+" (";
            for(i=0; i<di-1; i++){
              mess=mess+inputs[dep[i]].data("name")+", ";
            }
            mess=mess+"and "+inputs[dep[di-1]].data("name")+").";
          }
          mess=mess+" Are you sure?";
          $("body").append("<div id='warn' class='dialog' title='Are you sure?'><p>"+mess+"</p></div>");
          $(function(){
            $("#warn").dialog({
              modal: true,
              buttons: {
                Yes: function(){
                  datasets[ds_edit].name=name;
                  datasets[ds_edit].values=ds_str_2_arr(data_str);
                  data_str="";
                  ds_valid=false;
                  var num, mean, stdev, r;
                  num=num_samples(datasets[ds_edit].values);
                  mean=mu(datasets[ds_edit].values);
                  stdev=sig(datasets[ds_edit].values, mean);
                  r=t_dist(num)*sig(datasets[ds_edit].values, mean)/Math.pow(num,1/2);
                  for(i=0; i<di; i++){
                    if(ds_edit==inputs[dep[i]].data("nom_ds")){
                      inputs[dep[i]].data("nominal", mean);
                    }
                    if(ds_edit==inputs[dep[i]].data("rand_ds")){
                      inputs[dep[i]].data("random", r);
                    }
                  }
                  ds_dialog.dialog("close");
                  $(this).dialog("close");
                  $("#warn").remove();
                  edit_ds_dialog.dialog("close");
                  $("#Datasets").click();
                },
                Cancel: function(){
                  $(this).dialog("close");
                  $("#warn").remove();
                }
              }
            })
          })
        } else {
          datasets[ds_edit].name=name;
          datasets[ds_edit].values=ds_str_2_arr(data_str);
          data_str="";
          ds_valid=false;
          ds_dialog.dialog("close");
          $("#Datasets").click();
          edit_ds_dialog.dialog("close");
        }
      } else {
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the dataset is not valid.";
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      edit_ds_dialog.dialog("close");
    }
  },
  close: empty_edit_ds_dialog
});

var edit_src_dialog=$("#edit_src_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_ds_dialog on dialog open, build_add_ds_dialog() found
  // in custom.js
  open: build_edit_src_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Dataset button to dialog with function action
    "Edit Source": function(){
      // Define warning array (warn), warning string (warn_str), warning
      // count (ws), and counter (i)
      var warn=[], warn_str, ws, i;
      // Grab dataset name from dialog
      var name=$("#edit_src_name").val().trim();

      var value=$("#edit_src_value").val().trim();
      // Check if dataset name exists
      if(name.length<=0){warn.push("name");}

      if(value.length<=0){warn.push("value");}
      // Check if any warnings were not thrown
      if(warn.length==0){
        var i, ni, di, dep=[], mess="";
        ni=inputs.length;
        for(i=0; i<ni; i++){
          if(inputs[i].data("sys_src").indexOf(src_edit)){
            dep.push(i);
          }
        }
        if(dep.length>0){
          di=dep.length;
          mess="This will modify value for input";
          if(di==1){
            mess=mess+" "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+").";
          } else {
            mess=mess+"s ";
            for(i=0; i<di-1; i++){
              mess=mess+(dep[i]+1)+", ";
            }
            mess=mess+"and "+(dep[di-1]+1)+" (";
            for(i=0; i<di-1; i++){
              mess=mess+inputs[dep[i]].data("name")+", ";
            }
            mess=mess+"and "+inputs[dep[di-1]].data("name")+").";
          }
          mess=mess+" Are you sure?";
          $("body").append("<div id='warn' class='dialog' title='Are you sure?'><p>"+mess+"</p></div>");
          $(function(){
            $("#warn").dialog({
              modal: true,
              buttons: {
                Yes: function(){
                  sources[src_edit].name=name;
                  sources[src_edit].value=value;
                  src_dialog.dialog("close");
                  $(this).dialog("close");
                  $("#warn").remove();
                  edit_src_dialog.dialog("close");
                  $("#Sources").click();
                },
                Cancel: function(){
                  $(this).dialog("close");
                  $("#warn").remove();
                }
              }
            })
          })
        } else {
          sources[src_edit].name=name;
          sources[src_edit].value=value;
          src_dialog.dialog("close");
          $("#Sources").click();
          edit_src_dialog.dialog("close");
        }
      } else {
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the source is not valid.";
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      edit_src_dialog.dialog("close");
    }
  },
  close: empty_edit_src_dialog
});

var edit_inp_dialog=$("#edit_inp_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_ds_dialog on dialog open, build_add_ds_dialog() found
  // in custom.js
  open: build_edit_inp_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Dataset button to dialog with function action
    "Edit Input": function(){
      // Define warning array (warn), warning string (warn_str), warning
      // count (ws), and counter (i)
      var warn=[], warn_str, ws, i, iof, cs=components.length;
      // Define variable regex
      var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
      // Define nominal value regex
      var nom_regex=/^[0-9][.0-9]*$/;
      // Grab input name from dialog
      var name=$("#edit_inp_name").val().trim();
      // Grab input variable from dialog
      var variable=$("#edit_inp_variable").val().trim();
      // Grab input label from dialog
      var label=$("#edit_inp_label").val().trim();
      // Grab input nominal value from dialog
      var nominal=$("#edit_inp_nominal").val().trim();
      // Grab input random uncertainty value from dialog
      var random=$("#edit_inp_random").val().trim();
      // Check if input name exists
      if (name.length<=0){warn.push("name");}
      // Check if input variable exists and is correct form
      if ((variable.length<=0) || !variable_regex.test(variable)){warn.push("variable");}
      // Check if input label exists
      if (label.length<=0){warn.push("label");}
      // Check if input nominal value exists and is correct form
      if ((nominal.length<=0) || !(nom_regex.test(nominal))){warn.push("nominal value");}
      // Check if input random uncertainty exists and is correct form
      if ((random.length<=0) || !(nom_regex.test(random))){warn.push("random uncertainty");}
      // Check if any warnings were not thrown
      if (warn.length==0){
        // Check if input variable is valid
        if(valid_variable(inputs, components, variable) || variable==inputs[inp_edit].data("variable")){
          // Declare input object default size
          var ow=50, oh=50, os=get_text_size(label);
          // if label is larger than object size, resize object
          if(os[0]>ow){ow=Math.round(os[0])+10;}
          if(os[1]>oh){oh=Math.round(os[1])+10;}
          if(ow>oh){oh=ow;}
          else {ow=oh;}
          // set input size
          inputs[inp_edit].attr({rx:ow/2, ry:oh/2});
          // set input name
          inputs[inp_edit].data("name", name);
          // if input variable is different, replace variable in component function
          if(inputs[inp_edit].data("variable")!=variable){
            for(i=0; i<cs; i++){
              components[i].data("fun",replace_var_expr(inputs[inp_edit].data("variable"), variable, components[i].data("fun")));
            }
          }
          // set input variable
          inputs[inp_edit].data("variable", variable);
          // set input label
          inputs[inp_edit].data("label", label);
          // set input nominal value
          inputs[inp_edit].data("nominal", nominal);

          inputs[inp_edit].data("nom_ds", Number(ds_nom));
          // set input random uncertainty value
          inputs[inp_edit].data("random", random);

          inputs[inp_edit].data("rand_ds", Number(ds_rand));
          // set input systematic uncertainty value
          inputs[inp_edit].data("sys_src", src_sys);
          // set input label object size
          input_labels[inp_edit].attr({width:ow, height:oh});
          // set input label object variable
          input_labels[inp_edit].data("variable", variable);
          // set input label object label
          input_labels[inp_edit].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(label);
          // Run custom function
          calc_comp_nom();
          // Reset Jacobian matrix flag
          flags.J=false;
          // Reset W matrix flag
          flags.W=false;
          // Reset Nu matrix flag
          flags.Nu=false;
          // Reset U matrix flag
          flags.U=false;
          // Empty component total uncertainty summary content
          $("#u_sum").remove();
          // Reset UMF flag
          flags.UMF=false;
          // Empty component UMF summary content
          $("#umf_sum").remove();
          // Reset UPC flag
          flags.UPC=false;
          // Empty component UPC summary content
          $("#upc_sum").remove();
          // Close dialog
          edit_inp_dialog.dialog("close");
        // if input variable is not valid
          edit_inp_dialog.dialog("close");
          inp_dialog.dialog("close");
          ds_nom=-1;
          ds_rand=-1;
          inp_edit=-1;
          src_sys=[];
          $("#Inputs").click();
        } else {
          $("body").append("<div id='warn' class='dialog' title='Warning'><p>Input variable must be unique.</p></div>");
          $(function(){
            $("#warn").dialog({
              modal: true,
              buttons: {
                Ok: function(){
                  $(this).dialog("close");
                  $("#warn").remove();
                }
              }
            })
          })
        }
      } else {
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the input is not valid.";
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      edit_inp_dialog.dialog("close");
    }
  },
  close: empty_edit_inp_dialog
});

var edit_comp_dialog=$("#edit_comp_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',

  open: build_edit_comp_dialog,

  buttons: {
    "Edit Component": function(){
      // Declare variables
      var warn=[], warn_str, ws, i, cs=components.length;
      // Declare variable regex
      var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
      // Get component name from field
      var name=$("#edit_comp_name").val().trim();
      // Get component variable from field
      var variable=$("#edit_comp_variable").val().trim();
      // Get component label from field
      var label=$("#edit_comp_label").val().trim();
      // Get component function from field
      var fun=$("#edit_comp_fun").val().trim();
      // If name is empty, push name warning
      if (name.length<=0){warn.push("name");}
      // If variable is empty or doesn't pass regex, push variable worning
      if ((variable.length<=0) || !variable_regex.test(variable)){warn.push("variable");}
      // If label is empty, push label warning
      if (label.length<=0){warn.push("label");}
      // check if function value is valid, add warning if it is not
      if (fun.length<=0 || get_dep(fun).length==0){warn.push("function");}
      // If no warning
      if (warn.length==0){
        // Check if component variable is valid
        if(valid_variable(inputs, components, variable) || variable==components[comp_edit].data("variable")){
          // Declare default component size, and label size
          var ow=50, oh=50, os=get_text_size(label);
          // If label size is larger than component size, increase component size
          if(os[0]>ow){ow=Math.round(os[0])+10;}
          if(os[1]>oh){oh=Math.round(os[1])+10;}
          if(ow>oh){oh=ow;}
          else {ow=oh;}
          // Declare component position
          var ox=components[comp_edit].attr("x")+components[comp_edit].attr("width")/2-ow/2;
          var oy=components[comp_edit].attr("y")+components[comp_edit].attr("height")/2-oh/2;
          // Set component position
          components[comp_edit].attr({x:ox, y:oy, width:ow, height:oh});
          // Set component name
          components[comp_edit].data("name", name);
          // component variable isn't the same as it was
          if(components[comp_edit].data("variable")!=variable){
            // for each component, replace variable in all other component functions
            for(i=0; i<cs; i++){
              components[i].data("fun",replace_var_expr(components[comp_edit].data("variable"), variable, components[i].data("fun")));
            }
          }
          // Set component variable
          components[comp_edit].data("variable", variable);
          // Set component label
          components[comp_edit].data("label", label);
          // Set component function
          components[comp_edit].data("fun", fun);
          // Set component label position
          component_labels[comp_edit].attr({x:components[comp_edit].attr("x")+ow/2, y:components[comp_edit].attr("y")+oh/2});
          // Set component label variable
          component_labels[comp_edit].data("variable", variable);
          // Change html of component label
          component_labels[comp_edit].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(label);
          component_labels[comp_edit].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");
          // get dependent variables from component funciton
          var dep_var=get_dep(fun);
          // get all input variables
          var inp_var=get_inp_var();
          // get all component variables
          var comp_var=get_comp_var();
          // get number of dependent variables
          var dvs=dep_var.length;
          // get number of inputs
          var ivs=inp_var.length;
          // get number of components
          var cvs=comp_var.length;
          // get number of connections
          var cs=connections.length;
          var nc=[];
          // for each connection, update connections
          for(i=0; i<cs; i++){
            if(connections[i].to.data("variable")==variable){
              connections[i].line.remove();
              connections[i].arr.remove();
            } else {
              nc.push(connections[i]);
            }
          }
          connections=nc;
          // for each input, update connections
          for(i=0; i<ivs; i++){
            if($.inArray(inp_var[i],dep_var)!=-1){
              r.addcon(inputs[i],components[comp_edit]);
            }
          }
          // for each component, update connections
          for(i=0; i<cvs; i++){
            if($.inArray(comp_var[i],dep_var)!=-1){
              r.addcon(components[i],components[comp_edit]);
            }
          }
          // Run custom function
          calc_comp_nom();
          comp_edit=-1;
          // Reset Jacobian matrix flag
          flags.J=false;
          // Reset W matrix flag
          flags.W=false;
          // Reset U matrix flag
          flags.U=false;
          // Remove component total uncertainty summary content
          $("#u_sum").remove();
          // Reset UMF flag
          flags.UMF=false;
          // Remove component UMF summary content
          $("#umf_sum").remove();
          // Reset component UPC flag
          flags.UPC=false;
          // Remove component UPC summary content
          $("#upc_sum").remove();
          // Close dialog
          edit_comp_dialog.dialog("close");
          comp_dialog.dialog("close");
          $("#Components").click();
        // if variable is not valid
        } else {
          // Invalid variable
          $("body").append("<div id='warn' class='dialog' title='Warning'><p>Component variable must be unique.</p></div>");
          $(function(){
            $("#warn").dialog({
              modal: true,
              buttons: {
                Ok: function(){
                  $(this).dialog("close");
                  $("#warn").remove();
                }
              }
            })
          })
        }
      // if warning
      } else {
        // Display warning
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the component is not valid."
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      edit_comp_dialog.dialog("close");
    }
  },
  close: empty_edit_comp_dialog
});



var del_ds_dialog=$("#del_ds_dialog").dialog({

  autoOpen: false,

  modal: true,

  open: build_del_ds_dialog,

  buttons: {
    Ok: function(){
      var i, ns=inputs.length;
      datasets.splice(ds_del, 1);
      for(i=0; i<ns; i++){
        if(inputs[i].data("nom_ds")==ds_del){
          inputs[i].data("nom_ds", -1);
        }
        if(inputs[i].data("rand_ds")==ds_del){
          inputs[i].data("rand_ds", -1);
        }
        if(inputs[i].data("nom_ds")>ds_del){
          inputs[i].data("nom_ds", inputs[i].data("nom_ds")-1);
        }
        if(inputs[i].data("rand_ds")>ds_del){
          inputs[i].data("rand_ds", inputs[i].data("rand_ds")-1);
        }
      }
      ds_del=-1;
      del_ds_dialog.dialog("close");
      ds_dialog.dialog("close");
      $("#Datasets").click();
    },
    Cancel: function(){
      ds_del=-1;
      del_ds_dialog.dialog("close");
    }
  },
  close: empty_del_ds_dialog
});

var del_src_dialog=$("#del_src_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',

  open: build_del_src_dialog,

  buttons: {
    Ok: function(){
      var i, j, ss, ta=[], ns=inputs.length;
      sources.splice(src_del, 1);
      for(i=0; i<ns; i++){
        ss=inputs[i].data("sys_src").length;
        for(j=0; j<ss; j++){
          if(inputs[i].data("sys_src")[j]==src_del){
            ta=inputs[i].data("sys_src");
            ta.splice(j, 1);
            inputs[i].data("sys_src", ta);
            ta=[];
            ss--;
          }
        }
        ss=inputs[i].data("sys_src").length;
        for(j=0; j<ss; j++){
          if(inputs[i].data("sys_src")[j]>src_del){
            ta=inputs[i].data("sys_src");
            ta[j]=ta[j]-1;
            inputs[i].data("sys_src", ta);
            ta=[];
          }
        }
      }
      src_del=-1;
      del_src_dialog.dialog("close");
      src_dialog.dialog("close");
      $("#Sources").click();
    },
    Cancel: function(){
      src_del=-1;
      del_src_dialog.dialog("close");
    }
  },
  close: empty_del_src_dialog
});

var del_inp_dialog=$("#del_inp_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',

  open: build_del_inp_dialog,

  buttons: {
    Ok: function(){

    }
  },
  close: empty_del_inp_dialog
});

var del_comp_dialog=$("#del_comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  open: build_del_comp_dialog,
  buttons: {
    Ok: function(){

    }
  },
  close: empty_del_comp_dialog
});



var sum_ds_dialog=$("#sum_ds_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_sum_ds_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    "Export CSV": function(){
      saveCSV(ds2CSV(),'datasets.csv');
      sum_ds_dialog.dialog("close");
    },
    Ok: function(){
      sum_ds_dialog.dialog("close");
    }
  },
  close: empty_sum_ds_dialog
});

var sum_src_dialog=$("#sum_src_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_sum_src_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    "Export CSV": function(){
      saveCSV(src2CSV(),'sources.csv');
      sum_src_dialog.dialog("close");
    },
    Ok: function(){
      sum_src_dialog.dialog("close");
    }
  },
  close: empty_sum_src_dialog
});

var sum_inp_dialog=$("#sum_inp_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_sum_inp_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    "Export CSV": function(){
      saveCSV(inp2CSV(),'inputs.csv');
      sum_inp_dialog.dialog("close");
    },
    Ok: function(){
      sum_inp_dialog.dialog("close");
    }
  },
  close: empty_sum_inp_dialog
});

var sum_comp_dialog=$("#sum_comp_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_sum_comp_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    "Export CSV": function(){
      saveCSV(comp2CSV(),'components.csv');
      sum_comp_dialog.dialog("close");
    },
    Ok: function(){
      sum_comp_dialog.dialog("close");
    }
  },
  close: empty_sum_comp_dialog
});

var sum_corr_dialog=$("#sum_corr_dialog").dialog({

  autoOpen: false,

  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_sum_corr_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    "Export CSV": function(){
      saveCSV(corr2CSV(),'correlations.csv');
      sum_corr_dialog.dialog("close");
    },
    Ok: function(){
      sum_corr_dialog.dialog("close");
    }
  },
  close: empty_sum_corr_dialog
});

var sum_u_dialog=$("#sum_u_dialog").dialog({
  autoOpen: false,
  modal: true,
  minWidth: '500px',
  width: 'auto',
  buttons: {
    "Export CSV": function(){
      saveCSV(U2CSV(),'totu.csv');
    },
    Ok: function(){
      sum_u_dialog.dialog("close");
    }
  },
  close: empty_sum_u_dialog
})

var sum_umf_dialog=$("#sum_umf_dialog").dialog({
  autoOpen: false,
  modal: true,
  minWidth: '500px',
  width: 'auto',
  buttons: {
    "Export CSV": function(){
      saveCSV(UMF2CSV(),'umf.csv');
    },
    Ok: function(){
      sum_umf_dialog.dialog("close");
    }
  },
  close: empty_sum_umf_dialog
})

var sum_upc_dialog=$("#sum_upc_dialog").dialog({
  autoOpen: false,
  modal: true,
  minWidth: '500px',
  width: 'auto',
  buttons: {
    "Export CSV": function(){
      saveCSV(UPC2CSV(),'upc.csv');
    },
    Ok: function(){
      sum_upc_dialog.dialog("close");
    }
  },
  close: empty_sum_upc_dialog
})



var apply_ds_2_nom_dialog=$("#apply_ds_2_nom_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_apply_ds_2_nom_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    Ok: function(){
      ds_nom=$("input[name=ds]:checked").val();
      if(typeof ds_nom=="undefined"){
        $("body").append("<div id='warn' class='dialog' title='No Dataset Select'><p>No dataset selected. Please select a dataset before proceeding.</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      } else {
        $("#add_inp_nominal").val(mu(datasets[ds_nom].values));
        $("#edit_inp_nominal").val(mu(datasets[ds_nom].values));
        apply_ds_2_nom_dialog.dialog("close");
      }
    },
    Cancel: function(){
      ds_nom=-1;
      apply_ds_2_nom_dialog.dialog("close");
    }
  },
  close: empty_apply_ds_2_nom_dialog
});

var apply_ds_2_rand_dialog=$("#apply_ds_2_rand_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_apply_ds_2_rand_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    Ok: function(){
      var n, mean;
      ds_rand=$("input[name=ds]:checked").val();
      if(typeof ds_rand=="undefined"){
        $("body").append("<div id='warn' class='dialog' title='No Dataset Select'><p>No dataset selected. Please select a dataset before proceeding.</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      } else {
        n=num_samples(datasets[ds_rand].values);
        mean=mu(datasets[ds_rand].values);
        $("#add_inp_random").val(t_dist(n)*sig(datasets[ds_rand].values, mean)/Math.pow(n,1/2));
        $("#edit_inp_random").val(t_dist(n)*sig(datasets[ds_rand].values, mean)/Math.pow(n,1/2));
        apply_ds_2_rand_dialog.dialog("close");
      }
    },
    Cancel: function(){
      ds_rand=-1;
      apply_ds_2_rand_dialog.dialog("close");
    }
  },
  close: empty_apply_ds_2_rand_dialog
});

var apply_src_2_sys_dialog=$("#apply_src_2_sys_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,

  width: 'auto',
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_apply_src_2_sys_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    Ok: function(){
      var i, n, mess="", src_select=[];
      $(".src").each(function(i){
        if(this.checked){
          src_select.push(i);
        }
      });
      src_sys=src_select;
      n=src_sys.length;
      if(n==0){
        $("#src_select").text("No sources have been selected. If no source(s) are selected, a value of zero will be used.");
      } else if(n==1){
        $("#src_select").text("Source id "+src_sys[0]+" selected.");
      } else {
        mess="";
        for(i=0; i<n-1; i++){
          mess+=src_sys[i]+", ";
        }
        mess+=" and "+src_sys[n-1];
        $("#src_select").text("Source ids "+mess+" selected.");
      }
      apply_src_2_sys_dialog.dialog("close");
    },
    Cancel: function(){
      apply_src_2_sys_dialog.dialog("close");
    }
  },
  close: empty_apply_src_2_sys_dialog
});



var calc_u_dialog=$("#calc_u_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: '500px',
  close: empty_calc_u_dialog
});

var calc_umf_dialog=$("#calc_umf_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: '500px',
  close: empty_calc_umf_dialog
});

var calc_upc_dialog=$("#calc_upc_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: '500px',
  close: empty_calc_upc_dialog
})















var exit_dialog=$("#exit_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  open: build_exit_dialog,
  buttons: {
    "Yes": function(){
      $("body").empty();
      $("body").append("<div style='position:absolute; height:95%; width:95%; display:table'><h1 style='display:table-cell; vertical-align:middle; text-align:center;'>See you later!</h1></div>");
      $("#exit_dialog").dialog("close");
    },
    No: function(){
      $("#exit_dialog").dialog("close");
    }
  },
  close: empty_exit_dialog
})

var new_dialog=$("#new_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  open: build_new_dialog,
  buttons: {
    Yes: function(){
      $("#new_dialog").dialog("close");
      location.reload();
    },
    No: function(){
      $("#new_dialog").dialog("close");
    }
  },
  close: empty_new_dialog
})

var save_dialog=$("#save_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: '250',
  open: build_save_dialog,
  buttons: {
    "Save As": function(){
      var filename=$("#save_filename").val().trim();
      if(filename.length>0){
        saveData(export_canvas(),filename+'.ujs');
        save_dialog.dialog("close");
      } else {
        $("body").append("<div id='warn' class='dialog' title='Warning'><p>Filename is required.</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      save_dialog.dialog("close")
    }
  },
  close: empty_save_dialog
})

var saveData=(function(){
  // Create a tag
  var a=document.createElement("a");
  // Add it to html body
  document.body.appendChild(a);
  // set a tag id
  a.id='file_download';
  // set a tag style
  a.style="display: none";
  return function(data, fileName){
    // turn data into JSON
    var json=JSON.stringify(data);
    // BLOB JSON
    var blob=new Blob([json], {type: "octet/stream"});
    // create url for BLOB
    var url=window.URL.createObjectURL(blob);
    // set a tag href
    a.href=url;
    // set a tag download to filename
    a.download=fileName;
    // click a tag
    a.click();
    // remove a tag url
    window.URL.revokeObjectURL(url);
    // remove a tag
    $("#file_download").remove();
  };
}())

window.onload=function(){

  build_toolbar();






  $("#Datasets").click(function(){
    ds_dialog.dialog("open");
    event.preventDefault();
  });

  $("#Sources").click(function(){
    src_dialog.dialog("open");
    $("#add_src").click(function(){
      add_src_dialog.dialog("open");
    });
    event.preventDefault();
  });

  $("#Inputs").click(function(){
    inp_dialog.dialog("open");
    $("#add_inp").click(function(){
      add_inp_dialog.dialog("open");
    });
    event.preventDefault();
  });

  $("#Components").click(function(){
    comp_dialog.dialog("open");
    $("#add_comp").click(function(){
      add_comp_dialog.dialog("open");
    });
    event.preventDefault();
  });



  $("#sum_ds").click(function(){
    sum_ds_dialog.dialog("open");
    event.preventDefault();
  });

  $("#sum_src").click(function(){
    sum_src_dialog.dialog("open");
    event.preventDefault();
  });

  $("#sum_inp").click(function(){
    sum_inp_dialog.dialog("open");
    event.preventDefault();
  });

  $("#sum_comp").click(function(){
    sum_comp_dialog.dialog("open");
    event.preventDefault();
  });

  $("#sum_corr").click(function(){
    sum_corr_dialog.dialog("open");
    event.preventDefault();
  });



  $("#calc_u").click(function(){
    // if there are inputs and components
    if(inputs.length>0 && components.length>0){
      // if U matrix flag is set
      if(!flags.U){calc_U()};
      $("#calc_u_dialog").append("<p>Calculating the components' total uncertainty is complete.");
      calc_u_dialog.dialog({
        title: "Calculation complete",
        buttons: {
          "View Results": function(){
            $("#sum_u").click();
            calc_u_dialog.dialog("close");
          },
          Ok: function(){
            calc_u_dialog.dialog("close");
          }
        }
      });
      calc_u_dialog.dialog("open");
    // if there aren't enough inputs or components
    } else {
      if(inputs.length>0){
        // Display add input and add component buttons
        $("#calc_u_dialog").append("<p>There are no components added to the system.</p>")
        calc_u_dialog.dialog({
          title: "Warning!",
          buttons: {
            "Add Components": function(){
              $("#Components").click();
              calc_u_dialog.dialog("close");
            },
            Ok: function(){
              calc_u_dialog.dialog("close");
            }
          }
        });
      } else {
        // Display add input and add component buttons
        $("#calc_u_dialog").append("<p>There are no inputs added to the system.</p>")
        calc_u_dialog.dialog({
          title: "Warning!",
          buttons: {
            "Add Inputs": function(){
              $("#Inputs").click();
              calc_u_dialog.dialog("close");
            },
            Ok: function(){
              calc_u_dialog.dialog("close");
            }
          }
        });
      }
      calc_u_dialog.dialog("open");
    }
    event.preventDefault();
  });

  $("#calc_umf").click(function(){
    // if there are inputs and components
    if(inputs.length>0 && components.length>0){
      // if UMF flag is set
      if(!flags.UMF){calc_UMF()};
      $("#calc_umf_dialog").append("<p>Calculating the uncertainty magnification factor is complete.");
      calc_umf_dialog.dialog({
        title: "Calculation complete",
        buttons: {
          "View Results": function(){
            $("#sum_umf").click();
            calc_umf_dialog.dialog("close");
          },
          Ok: function(){
            calc_umf_dialog.dialog("close");
          }
        }
      });
      calc_umf_dialog.dialog("open");
    // if there are not enough inputs or components
    } else {
      if(inputs.length>0){
        $("#calc_umf_dialog").append("<p>There are no components added to the system.</p>")
        calc_umf_dialog.dialog({
          title: "Warning!",
          buttons: {
            "Add Components": function(){
              $("#Components").click();
              calc_umf_dialog.dialog("close");
            },
            Ok: function(){
              calc_umf_dialog.dialog("close");
            }
          }
        });
      } else {
        $("#calc_umf_dialog").append("<p>There are no inputs added to the system.</p>")
        calc_umf_dialog.dialog({
          title: "Warning!",
          buttons: {
            "Add Inputs": function(){
              $("#Inputs").click();
              calc_umf_dialog.dialog("close");
            },
            Ok: function(){
              calc_umf_dialog.dialog("close");
            }
          }
        });
      }
      calc_umf_dialog.dialog("open");
    }
    event.preventDefault();
  })

  $("#calc_upc").click(function(){
    // if there are inputs and components
    if(inputs.length>0 && components.length>0){
      // if UPC flag is set
      if(!flags.UPC){calc_UPC()};
      $("#calc_upc_dialog").append("<p>Calculating the uncertainty percent contribution is complete.");
      calc_upc_dialog.dialog({
        title: "Calculation complete",
        buttons: {
          "View Results": function(){
            $("#sum_upc").click();
            calc_upc_dialog.dialog("close");
          },
          Ok: function(){
            calc_upc_dialog.dialog("close");
          }
        }
      });
      calc_upc_dialog.dialog("open");
    // if there are not enough inputs or components
    } else {
      if(inputs.length>0){
        $("#calc_upc_dialog").append("<p>There are no components added to the system.</p>")
        calc_upc_dialog.dialog({
          title: "Warning!",
          buttons: {
            "Add Components": function(){
              $("#Components").click();
              calc_upc_dialog.dialog("close");
            },
            Ok: function(){
              calc_upc_dialog.dialog("close");
            }
          }
        });
      } else {
        $("#calc_upc_dialog").append("<p>There are no inputs added to the system.</p>")
        calc_upc_dialog.dialog({
          title: "Warning!",
          buttons: {
            "Add Inputs": function(){
              $("#Inputs").click();
              calc_upc_dialog.dialog("close");
            },
            Ok: function(){
              calc_upc_dialog.dialog("close");
            }
          }
        });
      }
      calc_upc_dialog.dialog("open");
    }
    event.preventDefault();
  })














  $("#exit").click(function(){
    exit_dialog.dialog("open");
    event.preventDefault();
  })

  $("#holder").mousedown(function(event){
    if (r.getElementByPoint(event.pageX, event.pageY )!=null) {return;}
    mousedown=true;
    startX=event.pageX;
    startY=event.pageY;
  })

  $("#holder").mousemove(function(event){
    if (mousedown==false) {return;}
    dX=(startX-event.pageX)*(viewbox[2]/$("#holder").width());
    dY=(startY-event.pageY)*(viewbox[3]/$("#holder").height());
    r.setViewBox(viewbox[0]+dX, viewbox[1]+dY, viewbox[2], viewbox[3]);
  })

  $("#holder").mouseup(function(){
    if (mousedown==false) return;
    viewbox[0]+=dX;
    viewbox[1]+=dY;
    mousedown=false;
  })

  $("#new").click(function(){
    new_dialog.dialog("open");
    event.preventDefault();
  })

  $("#open").click(function(){
    $("body").append("<input id='file_open' type='file' accept='.ujs' style='display:none;'>");
    $("#file_open").trigger('click');
    document.getElementById('file_open').addEventListener('change', function(event){
      var files=event.target.files;
      var file=files[0];
      var reader=new FileReader();
      reader.onload=function(){
        build_canvas(JSON.parse(this.result));
        wheel({wheelDelta: 120, clientX: 0, clientY: 0});
        wheel({wheelDelta: -120, clientX: 0, clientY: 0});
        $("#file_open").remove();
        $("#u_sum").remove();
        $("#umf_sum").remove();
        $("#upc_sum").remove();
      }
      empty_canvas();
      reader.readAsText(file);
      $("#file_open").remove();
    }, false);
    event.preventDefault();
  })

  $("#save").click(function(){
    save_dialog.dialog("open");
    event.preventDefault();
  })

  $("#toggle_toolbar").click(function(){
    if($("#toggle_toolbar").html()=="View Toolbar"){
      build_toolbar();
      $("#toggle_toolbar").html("Hide Toolbar");
    } else {
      empty_toolbar();
      $("#toggle_toolbar").html("View Toolbar");
    }
    event.preventDefault();
  })

  $("#toggle_tip").click(function(){
    if($("#toggle_tip").html()=="View Element Info"){
      $("#tb_tip").click();
    } else {
      $("#tb_tip").click();
    }
    event.preventDefault();
  })

  $("#toggle_before").click(function(){
    if($("#toggle_before").html()=="View Dependency View (Green)"){
      $("#tb_before").click();
    } else {
      $("#tb_before").click();
    }
    event.preventDefault();
  })

  $("#toggle_after").click(function(){
    if($("#toggle_after").html()=="View Dependency View (Red)"){
      $("#tb_after").click();
    } else {
      $("#tb_after").click();
    }
    event.preventDefault();
  })

  $("#toggle_correlation").click(function(){
    if($("#toggle_correlation").html()=="View Correlation View (Blue)"){
      $("#tb_cor").click();
    } else {
      $("#tb_cor").click();
    }
    event.preventDefault();
  })

  $(document).keypress(function(event) {
      if(event.which == 13) {
          event.preventDefault();
      }
  })

  window.addEventListener("resize", function() {
    wheel({wheelDelta: 120, clientX: 0, clientY: 0});
    wheel({wheelDelta: -120, clientX: 0, clientY: 0});
  })
  window.addEventListener('DOMMouseScroll', wheel, false);
  window.onmousewheel=document.onmousewheel=wheel;
};
