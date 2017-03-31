
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
  height: 'auto',
  resizable: false,
  open: build_ds_dialog,
  buttons: {
    Ok: ds_action_ok
  },
  close: empty_dialog
});

var src_dialog=$("#src_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_src_dialog,
  buttons: {
    Ok: src_action_ok
  },
  close: empty_dialog
});

var inp_dialog=$("#inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_inp_dialog,

  buttons: {
    Ok: inp_action_ok
  },
  close: empty_dialog
});

var comp_dialog=$("#comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_comp_dialog,
  buttons: {
    Ok: comp_action_ok
  },
  close: empty_dialog
});



var add_ds_dialog=$("#add_ds_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_add_ds_dialog,
  buttons: {
    "Add Dataset": add_ds_action_add_dataset,
    Cancel: add_ds_action_cancel
  },
  close: empty_dialog
});

var add_src_dialog=$("#add_src_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_add_src_dialog,
  buttons: {
    "Add Source": add_src_action_add_source,
    Cancel: add_src_action_cancel
  },
  close: empty_dialog
});

var add_inp_dialog=$("#add_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_add_inp_dialog,
  buttons: {
    "Add Input": add_inp_action_add_input,
    Cancel: add_inp_action_cancel
  },
  close: empty_dialog
});

var add_comp_dialog=$("#add_comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_add_comp_dialog,
  buttons: {
    "Add Component": add_comp_action_add_component,
    Cancel: add_comp_action_cancel
  },
  close: empty_dialog
});



var edit_ds_dialog=$("#edit_ds_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_edit_ds_dialog,
  buttons: {
    "Edit Dataset": edit_ds_action_edit_dataset,
    Cancel: edit_ds_action_cancel
  },
  close: empty_dialog
});

var edit_src_dialog=$("#edit_src_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_edit_src_dialog,
  buttons: {
    "Edit Source": edit_src_action_edit_source,
    Cancel: edit_src_action_cancel
  },
  close: empty_dialog
});

var edit_inp_dialog=$("#edit_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_edit_inp_dialog,
  buttons: {
    "Edit Input": edit_inp_action_edit_input,
    Cancel: edit_inp_action_cancel
  },
  close: empty_dialog
});

var edit_comp_dialog=$("#edit_comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_edit_comp_dialog,
  buttons: {
    "Edit Component": edit_comp_action_edit_component,
    Cancel: edit_comp_action_cancel
  },
  close: empty_dialog
});



var del_ds_dialog=$("#del_ds_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_del_ds_dialog,
  buttons: {
    Ok: del_ds_action_ok,
    Cancel: del_ds_action_cancel
  },
  close: empty_dialog
});

var del_src_dialog=$("#del_src_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_del_src_dialog,
  buttons: {
    Ok: del_src_action_ok,
    Cancel: del_src_action_cancel
  },
  close: empty_dialog
});

var del_inp_dialog=$("#del_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_del_inp_dialog,
  title: "Confirmation",
  buttons: {
    Yes: del_inp_action_yes,
    No: del_inp_action_no
  },
  close: empty_dialog
});

var del_comp_dialog=$("#del_comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: 500,
  height: 'auto',
  resizable: false,
  open: build_del_comp_dialog,
  title: "Confirmation",
  buttons: {
    Yes: del_comp_action_yes,
    No: del_comp_action_no
  },
  close: empty_dialog
});



var sum_ds_dialog=$("#sum_ds_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_ds_dialog,
  buttons: {
    "Export CSV": sum_ds_action_export_csv,
    Ok: sum_ds_action_ok
  },
  close: empty_dialog
});

var sum_src_dialog=$("#sum_src_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_src_dialog,
  buttons: {
    "Export CSV": sum_src_action_export_csv,
    Ok: sum_src_action_ok
  },
  close: empty_dialog
});

var sum_inp_dialog=$("#sum_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_inp_dialog,
  buttons: {
    "Export CSV": sum_inp_action_export_csv,
    Ok: sum_inp_action_ok
  },
  close: empty_dialog
});

var sum_comp_dialog=$("#sum_comp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_comp_dialog,
  buttons: {
    "Export CSV": sum_comp_action_export_csv,
    Ok: sum_comp_action_ok
  },
  close: empty_dialog
});

var sum_corr_dialog=$("#sum_corr_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_sum_corr_dialog,
  buttons: {
    "Export CSV": sum_corr_action_export_csv,
    Ok: sum_corr_action_ok
  },
  close: empty_dialog
});

var sum_u_dialog=$("#sum_u_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  buttons: {
    "Export CSV": sum_u_action_export_csv,
    Ok: sum_u_action_ok
  },
  close: empty_dialog
})

var sum_umf_dialog=$("#sum_umf_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  buttons: {
    "Export CSV": sum_umf_action_export_csv,
    Ok: sum_umf_action_ok
  },
  close: empty_dialog
})

var sum_upc_dialog=$("#sum_upc_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  buttons: {
    "Export CSV": sum_upc_action_export_csv,
    Ok: sum_upc_action_ok
  },
  close: empty_dialog
})



var apply_ds_2_nom_dialog=$("#apply_ds_2_nom_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_apply_ds_2_nom_dialog,
  buttons: {
    Ok: apply_ds_2_nom_action_ok,
    Cancel: apply_ds_2_nom_action_cancel
  },
  close: empty_dialog
});

var apply_ds_2_rand_dialog=$("#apply_ds_2_rand_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_apply_ds_2_rand_dialog,
  buttons: {
    Ok: apply_ds_2_rand_action_ok,
    Cancel: apply_ds_2_rand_action_cancel
  },

  close: empty_dialog
});

var apply_src_2_sys_dialog=$("#apply_src_2_sys_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_apply_src_2_sys_dialog,
  buttons: {
    Ok: apply_src_2_sys_action_ok,
    Cancel: apply_src_2_sys_action_cancel
  },
  close: empty_dialog
});



var calc_u_dialog=$("#calc_u_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_calc_u_dialog,
  close: empty_dialog
});

var calc_umf_dialog=$("#calc_umf_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_calc_umf_dialog,
  close: empty_dialog
});

var calc_upc_dialog=$("#calc_upc_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_calc_upc_dialog,
  close: empty_dialog
})



var exit_dialog=$("#exit_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_exit_dialog,
  buttons: {
    Yes: exit_action_yes,
    No: exit_action_no
  },
  close: empty_dialog
});

var new_dialog=$("#new_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_new_dialog,
  buttons: {
    Yes: new_action_yes,
    No: new_action_no
  },
  close: empty_dialog
})

var save_dialog=$("#save_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  height: 'auto',
  resizable: false,
  open: build_save_dialog,
  buttons: {
    "Save As": save_action_save_as,
    Cancel: save_action_cancel
  },
  close: empty_dialog
})

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
    calc_u_dialog.dialog("open");
    event.preventDefault();
  });

  $("#calc_umf").click(function(){
    calc_umf_dialog.dialog("open");
    event.preventDefault();
  });

  $("#calc_upc").click(function(){
    calc_upc_dialog.dialog("open");
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
