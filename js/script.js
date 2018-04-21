/*
@@
@@ Copyright (C) 2015, Mississippi State University.
@@ All rights reserved.
@@ This code is licensed under a modified BSD 3-Clause license.
@@ See the LICENSE file for details.
@@
*/
var inputs=[], components=[], input_labels=[], component_labels=[],
    connections=[], datasets=[], sources=[], src_sys=[], J=[], Nu=[], U=[],
    UMF=[], UPC=[], W=[], zoom=1, startX, startY, dX, dY, mousedown=false,
    data_str, ds_valid=false, ds_edit=-1, src_edit=-1, inp_edit=-1,
    comp_edit=-1, ds_nom=-1, ds_rand=-1, ds_del=-1, src_del=-1, inp_del=-1,
    comp_del=-1;

var flags={info:false, before:false, after:false, cor:false, J:false, Nu:false,
    U:false, UMF:false, UPC:false, W:false};
// create the Raphaeljs paper and set the viewbox to all zooming
var r=Raphael("holder", "100%", "100%");
var viewbox=[0, 0, $("#holder").width(), $("#holder").height()];
r.setViewBox(0, 0, $("#holder").width(), $("#holder").height());

//****************************** Action Dialogs ******************************//

// ds_dialog is the dialog handle for the dataset dialog
var ds_dialog=$("#ds_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_ds_dialog,
  buttons: {Ok: ds_button_ok},
  close: empty_dialog
});

// src_dialog is the dialog handle for the source dialog
var src_dialog=$("#src_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_src_dialog,
  buttons: {Ok: src_button_ok},
  close: empty_dialog
});

// inp_dialog is the dialog handle for the input dialog
var inp_dialog=$("#inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_inp_dialog,
  buttons: {Ok: inp_button_ok},
  close: empty_dialog
});

// comp_dialog is the dialog handle for the component dialog
var comp_dialog=$("#comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_comp_dialog,
  buttons: {Ok: comp_button_ok},
  close: empty_dialog
});

//******************************* Add Dialogs ********************************//

// add_ds_dialog is the dialog handle for the add dataset dialog
var add_ds_dialog=$("#add_ds_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_add_ds_dialog,
  buttons: {
    "Add Dataset": add_ds_button_add_dataset,
    Cancel: add_ds_button_cancel
  },
  close: empty_dialog
});

// add_src_dialog is the dialog handle for the add source dialog
var add_src_dialog=$("#add_src_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_add_src_dialog,
  buttons: {
    "Add Source": add_src_button_add_source,
    Cancel: add_src_button_cancel
  },
  close: empty_dialog
});

// add_inp_dialog is the dialog handle for the add input dialog
var add_inp_dialog=$("#add_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_add_inp_dialog,
  buttons: {
    "Add Input": add_inp_button_add_input,
    Cancel: add_inp_button_cancel
  },
  close: empty_dialog
});

// add_comp_dialog is the dialog handle for the add component dialog
var add_comp_dialog=$("#add_comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_add_comp_dialog,
  buttons: {
    "Add Component": add_comp_button_add_component,
    Cancel: add_comp_button_cancel
  },
  close: empty_dialog
});

//******************************* Edit Dialogs *******************************//

// edit_ds_dialog is the dialog handle for the edit dataset dialog
var edit_ds_dialog=$("#edit_ds_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_edit_ds_dialog,
  buttons: {
    "Edit Dataset": edit_ds_button_edit_dataset,
    Cancel: edit_ds_button_cancel
  },
  close: empty_dialog
});

// edit_src_dialog is the dialog handle for the edit source dialog
var edit_src_dialog=$("#edit_src_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_edit_src_dialog,
  buttons: {
    "Edit Source": edit_src_button_edit_source,
    Cancel: edit_src_button_cancel
  },
  close: empty_dialog
});

// edit_inp_dialog is the dialog handle for the edit input dialog
var edit_inp_dialog=$("#edit_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_edit_inp_dialog,
  buttons: {
    "Edit Input": edit_inp_button_edit_input,
    Cancel: edit_inp_button_cancel
  },
  close: empty_dialog
});

// edit_comp_dialog is the dialog handle for the edit component dialog
var edit_comp_dialog=$("#edit_comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_edit_comp_dialog,
  buttons: {
    "Edit Component": edit_comp_button_edit_component,
    Cancel: edit_comp_button_cancel
  },
  close: empty_dialog
});

//****************************** Delete Dialogs ******************************//

// del_ds_dialog is the dialog handle for the delete dataset dialog
var del_ds_dialog=$("#del_ds_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_del_ds_dialog,
  buttons: {
    Ok: del_ds_button_ok,
    Cancel: del_ds_button_cancel
  },
  close: empty_dialog
});

// del_src_dialog is the dialog handle for the delete source dialog
var del_src_dialog=$("#del_src_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_del_src_dialog,
  buttons: {
    Ok: del_src_button_ok,
    Cancel: del_src_button_cancel
  },
  close: empty_dialog
});

// del_inp_dialog is the dialog handle for the delete input dialog
var del_inp_dialog=$("#del_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_del_inp_dialog,
  title: "Confirmation",
  buttons: {
    Yes: del_inp_button_yes,
    No: del_inp_button_no
  },
  close: empty_dialog
});

// del_comp_dialog is the dialog handle for the delete component dialog
var del_comp_dialog=$("#del_comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_del_comp_dialog,
  title: "Confirmation",
  buttons: {
    Yes: del_comp_button_yes,
    No: del_comp_button_no
  },
  close: empty_dialog
});

//***************************** Summary Dialogs ******************************//

// sum_ds_dialog is the dialog handle for the dataset summary dialog
var sum_ds_dialog=$("#sum_ds_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_ds_dialog,
  buttons: {
    "Export CSV": sum_ds_button_export_csv,
    Ok: sum_ds_button_ok
  },
  close: empty_dialog
});

// sum_src_dialog is the dialog handle for the source summary dialog
var sum_src_dialog=$("#sum_src_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_src_dialog,
  buttons: {
    "Export CSV": sum_src_button_export_csv,
    Ok: sum_src_button_ok
  },
  close: empty_dialog
});

// sum_inp_dialog is the dialog handle for the input summary dialog
var sum_inp_dialog=$("#sum_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_inp_dialog,
  buttons: {
    "Export CSV": sum_inp_button_export_csv,
    Ok: sum_inp_button_ok
  },
  close: empty_dialog
});

// sum_comp_dialog is the dialog handle for the component summary dialog
var sum_comp_dialog=$("#sum_comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_comp_dialog,
  buttons: {
    "Export CSV": sum_comp_button_export_csv,
    Ok: sum_comp_button_ok
  },
  close: empty_dialog
});

// sum_corr_dialog is the dialog handle for the correlation summary dialog
var sum_corr_dialog=$("#sum_corr_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_corr_dialog,
  buttons: {
    "Export CSV": sum_corr_button_export_csv,
    Ok: sum_corr_button_ok
  },
  close: empty_dialog
});

// sum_u_dialog is the dialog handle for the component total uncertainty
// summary dialog
var sum_u_dialog=$("#sum_u_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_u_dialog,
  buttons: {
    "Export CSV": sum_u_button_export_csv,
    Ok: sum_u_button_ok
  },
  close: empty_dialog
});

// sum_umf_dialog is the dialog handle for the uncertainty magnification factor
// summary dialog
var sum_umf_dialog=$("#sum_umf_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_umf_dialog,
  buttons: {
    "Export CSV": sum_umf_button_export_csv,
    Ok: sum_umf_button_ok
  },
  close: empty_dialog
});

// sum_upc_dialog is the dialog handle for the uncertainty percent contribution
// summary dialog
var sum_upc_dialog=$("#sum_upc_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_upc_dialog,
  buttons: {
    "Export CSV": sum_upc_button_export_csv,
    Ok: sum_upc_button_ok
  },
  close: empty_dialog
});

//****************************** Apply Dialogs *******************************//

// apply_ds_2_nom_dialog is the dialog handle for applying a dataset to a input
// nominal value dialog
var apply_ds_2_nom_dialog=$("#apply_ds_2_nom_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_apply_ds_2_nom_dialog,
  buttons: {
    Ok: apply_ds_2_nom_button_ok,
    Cancel: apply_ds_2_nom_button_cancel
  },
  close: empty_dialog
});

// apply_ds_2_rand_dialog is the dialog handle for applying a dataset to a input
// random uncertainty value dialog
var apply_ds_2_rand_dialog=$("#apply_ds_2_rand_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_apply_ds_2_rand_dialog,
  buttons: {
    Ok: apply_ds_2_rand_button_ok,
    Cancel: apply_ds_2_rand_button_cancel
  },
  close: empty_dialog
});

// apply_src_2_sys_dialog is the dialog handle for applying a source to a input
// systematic uncertainty source dialog
var apply_src_2_sys_dialog=$("#apply_src_2_sys_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_apply_src_2_sys_dialog,
  buttons: {
    Ok: apply_src_2_sys_button_ok,
    Cancel: apply_src_2_sys_button_cancel
  },
  close: empty_dialog
});

//**************************** Calculate Dialogs *****************************//

// calc_u_dialog is the dialog handle for the calculating component total
// uncertainty dialog
var calc_u_dialog=$("#calc_u_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_calc_u_dialog,
  close: empty_dialog
});

// calc_umf_dialog is the dialog handle for the calculating uncertainty
// magnification factor dialog
var calc_umf_dialog=$("#calc_umf_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_calc_umf_dialog,
  close: empty_dialog
});

// calc_upc_dialog is the dialog handle for the calculating uncertainty percent
// contribution dialog
var calc_upc_dialog=$("#calc_upc_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_calc_upc_dialog,
  close: empty_dialog
});

//******************************* File Dialogs *******************************//

// exit_dialog is the dialog handle for the exit dialog
var exit_dialog=$("#exit_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_exit_dialog,
  buttons: {
    Yes: exit_button_yes,
    No: exit_button_no
  },
  close: empty_dialog
});

// new_dialog is the dialog handle for the new dialog
var new_dialog=$("#new_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_new_dialog,
  buttons: {
    Yes: new_button_yes,
    No: new_button_no
  },
  close: empty_dialog
});

// save_dialog is the dialog handle for the save dialog
var save_dialog=$("#save_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_save_dialog,
  buttons: {
    "Save As": save_button_save_as,
    Cancel: save_button_cancel
  },
  close: empty_dialog
});

var error_dialog=$("#error_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_error_dialog,
  buttons: {
    'Yes': error_send,
    'No': error_cancel
  },
  close: empty_dialog
});

// once the page loads
window.onload=function(){

  // build the toolbar
  build_toolbar();

//*************************** Action Click Events ****************************//

  // click event for dataset action
  $("#Datasets").click(function(e){
    ds_dialog.dialog("open");
    e.preventDefault();
  });

  // click event for source action
  $("#Sources").click(function(e){
    src_dialog.dialog("open");
    $("#add_src").click(function(){
      add_src_dialog.dialog("open");
    });
    e.preventDefault();
  });

  // click event for input action
  $("#Inputs").click(function(e){
    inp_dialog.dialog("open");
    $("#add_inp").click(function(){
      add_inp_dialog.dialog("open");
    });
    e.preventDefault();
  });

  // click event for component action
  $("#Components").click(function(e){
    comp_dialog.dialog("open");
    $("#add_comp").click(function(){
      add_comp_dialog.dialog("open");
    });
    e.preventDefault();
  });

//*************************** Summary Click Events ***************************//

  // click event for dataset summary
  $("#sum_ds").click(function(e){
    sum_ds_dialog.dialog("open");
    e.preventDefault();
  });

  // click event for source summary
  $("#sum_src").click(function(e){
    sum_src_dialog.dialog("open");
    e.preventDefault();
  });

  // click event for input summary
  $("#sum_inp").click(function(e){
    sum_inp_dialog.dialog("open");
    e.preventDefault();
  });

  // click event for component summary
  $("#sum_comp").click(function(e){
    sum_comp_dialog.dialog("open");
    e.preventDefault();
  });

  // click event for correlation summary
  $("#sum_corr").click(function(e){
    sum_corr_dialog.dialog("open");
    e.preventDefault();
  });

//************************** Calculate Click Events **************************//

  // click event for calculate component total uncertainty
  $("#calc_u").click(function(e){
    calc_u_dialog.dialog("open");
    e.preventDefault();
  });

  // click event for calculate uncertainty magnification factor
  $("#calc_umf").click(function(e){
    calc_umf_dialog.dialog("open");
    e.preventDefault();
  });

  // click event for calculate uncertainty percent contribution
  $("#calc_upc").click(function(e){
    calc_upc_dialog.dialog("open");
    e.preventDefault();
  });

//**************************** File Click Events *****************************//

  // click event for exit
  $("#exit").click(function(e){
    exit_dialog.dialog("open");
    e.preventDefault();
  });

  // click event for new
  $("#new").click(function(e){
    new_dialog.dialog("open");
    e.preventDefault();
  });

  // click event for open
  $("#open").click(function(e){
    // add input tag to body
    $("body").append("<input id='file_open' type='file' accept='.ujs' style=\
      'display:none;'>");
    // trigger click of input tag
    $("#file_open").trigger('click');
    // get file when ready
    document.getElementById('file_open').addEventListener('change',
      function(event){
      // process file
      var files=event.target.files;
      var file=files[0];
      var reader=new FileReader();
      reader.onload=function(){
        // empty the current canvas
        empty_canvas();
        // build system from file
        build_canvas(JSON.parse(this.result));
        // set previous zoom and view
        wheel({wheelDelta: 120, clientX: 0, clientY: 0});
        wheel({wheelDelta: -120, clientX: 0, clientY: 0});
        // remove file open input tag
        $("#file_open").remove();
        // remove summaries
        $("#sum_u").remove();
        $("#sum_umf").remove();
        $("#sum_upc").remove();
      }
      // read file as text
      reader.readAsText(file);
      // remove file open input tag
      $("#file_open").remove();
    }, false);
    e.preventDefault();
  });

  // click event for save
  $("#save").click(function(e){
    save_dialog.dialog("open");
    e.preventDefault();
  });

//******************************* Mouse Events *******************************//

  // mousedown event
  $("#holder").mousedown(function(e){
    // if mousedown not on canvas, return null
    if(r.getElementByPoint(e.pageX, e.pageY)!=null){return;}
    // set mousedown to true
    mousedown=true;
    // set start x and y
    startX=e.pageX;
    startY=e.pageY;
  });

  // mousemove event
  $("#holder").mousemove(function(e){
    // if mousedown is not set, return null
    if(!mousedown){return;}
    // get how much moved in the x and y direction
    dX=(startX-e.pageX)*(viewbox[2]/$("#holder").width());
    dY=(startY-e.pageY)*(viewbox[3]/$("#holder").height());
    // set viewbox to change by amount moved
    r.setViewBox(viewbox[0]+dX, viewbox[1]+dY, viewbox[2], viewbox[3]);
  });

  // mouseup event
  $("#holder").mouseup(function(){
    // if mousedown is not set, return null
    if(!mousedown){return};
    // if dX and dY are numbers, change viewbox x and y by amount moved
    if(!isNaN(dX)){viewbox[0]+=dX;}
    if(!isNaN(dY)){viewbox[1]+=dY;}
    // set mousedown to false
    mousedown=false;
  });

//************************** Toolbar Toggle Events ***************************//

  // toggle toolbar click event
  $("#toggle_toolbar").click(function(e){
    // if toolbar is hidden on click
    if($("#toggle_toolbar").html()=="View Toolbar"){
      // build toolbar and show hide toolbar
      build_toolbar();
      $("#toggle_toolbar").html("Hide Toolbar");
    // if toolbar is not hidden on click
    } else {
      // remove toolbar and show view toolbar
      empty_toolbar();
      $("#toggle_toolbar").html("View Toolbar");
    }
    e.preventDefault();
  });

  // toggle element info view click event
  $("#toggle_tip").click(function(e){
    $("#tb_tip").click();
    e.preventDefault();
  });

  // toggle backward dependencies view click event
  $("#toggle_before").click(function(e){
    $("#tb_before").click();
    e.preventDefault();
  });

  // toggle forward dependencies view click event
  $("#toggle_after").click(function(e){
    $("#tb_after").click();
    e.preventDefault();
  });

  // toggle correlation view click event
  $("#toggle_correlation").click(function(e){
    $("#tb_cor").click();
    e.preventDefault();
  });

//***************************** Keypress Events ******************************//

  // keypress event
  $(document).keypress(function(e){
    // enter key is pressed, preventDefault
    if(e.which==13){e.preventDefault();}
  });

//****************************** Window Events *******************************//

  // window resize event
  window.addEventListener("resize", function(){
    // reset wheel values
    wheel({wheelDelta: 120, clientX: 0, clientY: 0});
    wheel({wheelDelta: -120, clientX: 0, clientY: 0});
    // resize any open dialogs
    resize($("#ds_dialog"));
    resize($("#src_dialog"));
    resize($("#inp_dialog"));
    resize($("#comp_dialog"));
    resize($("#del_ds_dialog"));
    resize($("#del_src_dialog"));
    resize($("#del_inp_dialog"));
    resize($("#del_comp_dialog"));
    resize($("#apply_ds_2_nom_dialog"));
    resize($("#apply_ds_2_rand_dialog"));
    resize($("#apply_src_2_sys_dialog"));
    resize($("#sum_ds_dialog"));
    resize($("#sum_src_dialog"));
    resize($("#sum_inp_dialog"));
    resize($("#sum_comp_dialog"));
    resize($("#sum_corr_dialog"));
    resize($("#sum_u_dialog"));
    resize($("#sum_umf_dialog"));
    resize($("#sum_upc_dialog"));
    resize($("#calc_u_dialog"));
    resize($("#calc_umf_dialog"));
    resize($("#calc_upc_dialog"));
    resize($("#new_dialog"));
    resize($("#save_dialog"));
    resize($("#exit_dialog"));
  });
  window.addEventListener('DOMMouseScroll', wheel, false);
  window.onmousewheel=document.onmousewheel=wheel;
  console.log('upload 2');
  console.log(browser());
  window.addEventListener('error', function(e){
    let stack=e.error.stack;
    let browser=browser();
    console.log(browser);
    console.log(stack);
  });
};
