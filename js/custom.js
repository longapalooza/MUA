/*
@@
@@ Copyright (C) 2015, Mississippi State University.
@@ All rights reserved.
@@ This code is licensed under a modified BSD 3-Clause license.
@@ See the LICENSE file for details.
@@
*/
//****************************************************************************//
//                                                                            //
//                            Raphaeljs Functions                             //
//                                                                            //
//****************************************************************************//
// These functions extend Rapheljs's basic functionality.                     //
//****************************************************************************//

// addcon adds a connection between two canvas objects
Raphael.fn.addcon=function(obj1, obj2){
  // pushes the connection onto the connection array
  connections.push(r.connection(obj1, obj2));
}

// addobj adds an object to the canvas
Raphael.fn.addobj=function(attr){
  var il, cl;
  // if the fill, strok, and opacity are set, set then to white, black, and not
  // transparent
  if(!attr.fill){attr.fill="#ffffff";}
  if(!attr.stroke){attr.stroke="#000000";}
  if(!attr.opacity){attr.opacity=1;}
  // if the object is an input
  if(attr.type=="ellipse"){
    // get the number of inputs
    il=inputs.length;
    // add input object to canvas
    inputs.push(r.ellipse(attr.x+attr.w/2, attr.y+attr.h/2, attr.w/2,
      attr.h/2));
    // add input data
    inputs[il].data("name", attr.name);
    inputs[il].data("variable", attr.variable);
    inputs[il].data("label", attr.label);
    inputs[il].data("nominal", attr.nominal);
    inputs[il].data("nom_ds", Number(attr.nom_ds));
    inputs[il].data("random", attr.random);
    inputs[il].data("rand_ds", Number(attr.rand_ds));
    inputs[il].data("sys_src", attr.sys_src);
    // set input colors, drag method, and hover method
    inputs[il].attr({fill: attr.fill, stroke: attr.stroke, "fill-opacity":
      attr.opacity, cursor: "move"});
    inputs[il].drag(r.onmove, r.onstart, r.onend);
    inputs[il].hover(r.hoverIn, r.hoverOut);
    // add input label object to canvas
    input_labels.push(r.text(attr.x+attr.w/2, attr.y+attr.h/2, attr.label));
    // add input label data
    input_labels[il].data("variable", attr.variable);
    // set input hover method, double click method, and cursor style
    input_labels[il].hover(r.hoverIn, r.hoverOut);
    input_labels[il].dblclick(r.editobj);
    input_labels[il].attr({cursor: "default"});
    // set input label to svg standards
    input_labels[il].node.getElementsByTagName("tspan")[0].innerHTML=
      svg_label(attr.label);
  // if the object is a component
  } else if(attr.type=="rect"){
    // get the number of components
    cl=components.length;
    // add component object to canvas
    components.push(r.rect(attr.x, attr.y, attr.w, attr.h));
    // add component data
    components[cl].data("name", attr.name);
    components[cl].data("variable", attr.variable);
    components[cl].data("label", attr.label);
    components[cl].data("fun", attr.fun);
    // set component colors, drag method, and hover method
    components[cl].attr({fill: attr.fill, stroke: attr.stroke, "fill-opacity":
      attr.opacity, cursor: "move"});
    components[cl].drag(r.onmove, r.onstart, r.onend);
    components[cl].hover(r.hoverIn, r.hoverOut);
    // add component label object ot canvas
    component_labels.push(r.text(attr.x+attr.w/2, attr.y+attr.h/2, attr.label));
    // add component label data
    component_labels[cl].data("variable", attr.variable);
    // set component hover method, double click method, and cursor style
    component_labels[cl].hover(r.hoverIn, r.hoverOut);
    component_labels[cl].dblclick(r.editobj);
    component_labels[cl].attr({cursor: "default"});
    // set component label to svg standards
    component_labels[cl].node.getElementsByTagName("tspan")[0].innerHTML=
      svg_label(attr.label);
  }
}

// connection draws the connection between two canvas objects. Determines exit
// and entry point of connection.
Raphael.fn.connection=function(obj1, obj2){
  var bb1, bb2, p, i1, i2, dx, dy, d={}, dis=[], res=[], line, x1, y1, x2, y2,
      x3, y3, x4, y4, ax1, ay1, ax2, ay2, ax3, ay3, path, arr_path;
  // Check if obj1 and line, from, and to attribute
  if(obj1.line && obj1.from && obj1.to){
    // Set line to obj1
    line=obj1;
    // Set obj1 to line from attribute
    obj1=line.from;
    // Set obj2 to line to attribute
    obj2=line.to;
    // Set arr to line arr attribute
    arr=line.arr;
  }
  // Get bounding box of object
  bb1=obj1.getBBox();
  bb2=obj2.getBBox();
  p=[{x: bb1.x+bb1.width/2, y: bb1.y-1},
    {x: bb1.x+bb1.width/2, y: bb1.y+bb1.height+1},
    {x: bb1.x-1, y: bb1.y+bb1.height/2},
    {x: bb1.x+bb1.width+1, y: bb1.y+bb1.height/2},
    {x: bb2.x+bb2.width/2, y: bb2.y-1},
    {x: bb2.x+bb2.width/2, y: bb2.y+bb2.height+1},
    {x: bb2.x-1, y: bb2.y+bb2.height/2},
    {x: bb2.x+bb2.width+1, y: bb2.y+bb2.height/2}];
  // Figure out where the arrow should point to (North, East, South, or West
  // of object)
  for(i1=0; i1<4; i1++){
    for(i2=4; i2<8; i2++){
      dx=Math.abs(p[i1].x-p[i2].x);
      dy=Math.abs(p[i1].y-p[i2].y);
      if((i1==i2-4) || (((i1!=3 && i2!=6) || p[i1].x<p[i2].x) && ((i1!=2 &&
        i2!=7) || p[i1].x>p[i2].x) && ((i1!=0 && i2!=5) || p[i1].y>p[i2].y) &&
        ((i1!=1 && i2!=4) || p[i1].y<p[i2].y))){
        dis.push(dx+dy);
        d[dis[dis.length-1]]=[i1, i2];
        }
      }
  }
  if(dis.length==0){
    res=[0, 4];
  } else {
    res=d[Math.min.apply(Math, dis)];
  }
  x1=p[res[0]].x;
  y1=p[res[0]].y;
  x4=p[res[1]].x;
  y4=p[res[1]].y;
  dx=Math.max(Math.abs(x1-x4)/2, 10);
  dy=Math.max(Math.abs(y1-y4)/2, 10);
  x2=[x1, x1, x1 - dx, x1+dx][res[0]].toFixed(3);
  y2=[y1-dy, y1+dy, y1, y1][res[0]].toFixed(3);
  x3=[0, 0, 0, 0, x4, x4, x4-dx, x4+dx][res[1]].toFixed(3);
  y3=[0, 0, 0, 0, y1+dy, y1-dy, y4, y4][res[1]].toFixed(3);
  x1=x1.toFixed(3);
  y1=y1.toFixed(3);
  x4=x4.toFixed(3);
  y4=y4.toFixed(3);
  if(res[1]==4){
    ax1=-3;
    ay1=-7;
    ax2=6;
    ay2=0;
  } else if(res[1]==5){
    ax1=3;
    ay1=7;
    ax2=-6;
    ay2=0;
  } else if(res[1]==6){
    ax1=-7;
    ay1=3;
    ax2=0;
    ay2=-6;
  } else {
    ax1=7;
    ay1=-3;
    ax2=0;
    ay2=6;
  }
  // Define the path of the arrow
  path=["M", x1, y1, "C", x2, y2, x3, y3, x4, y4].join(",");
  // Define the arrow head path
  arr_path=["M", x4, y4, "l", ax1, ay1, "l", ax2, ay2, "z"].join(",");
  // Set the line, and arrow attribute
  if(line && line.line){
    line.line.attr({path: path});
    arr.attr({path: arr_path});
  } else {
    return {
      line: this.path(path).attr({stroke: "#000000"}),
      from: obj1,
      to: obj2,
      arr: this.path(arr_path).attr({stroke: "#000000", fill: "#000000"})
    };
  }
}

// editobj edits an object
Raphael.fn.editobj=function(){
  // tries to get input id of object
  var li=varID(inputs, this.data("variable"));
  // if object has input id, object is an input
  if(li!==false){
    // set inp_edit to input id
    inp_edit=li;
    // get input data
    var name=inputs[inp_edit].data("name");
    var variable=inputs[inp_edit].data("variable");
    var label=inputs[inp_edit].data("label");
    var nominal=inputs[inp_edit].data("nominal");
    var nom_ds=inputs[inp_edit].data("nom_ds");
    var random=inputs[inp_edit].data("random");
    var rand_ds=inputs[inp_edit].data("rand_ds");
    var sys_src=inputs[inp_edit].data("sys_src");
    // open edit input dialog
    edit_inp_dialog.dialog("open");
    // set edit input fields to input values
    $("#edit_inp_name").val(name);
    $("#edit_inp_variable").val(variable);
    $("#edit_inp_label").val(label);
    $("#edit_inp_nominal").val(nominal);
    ds_nom=nom_ds;
    $("#edit_inp_random").val(random);
    ds_rand=rand_ds;
    src_sys=sys_src;
  // if object does not have input id, it's a component
  } else {
    // set comp_edit to component id
    comp_edit=varID(components, this.data("variable"));
    // get component data
    var name=components[comp_edit].data("name");
    var variable=components[comp_edit].data("variable");
    var label=components[comp_edit].data("label");
    var fun=components[comp_edit].data("fun");
    // open edit component dialog
    edit_comp_dialog.dialog("open");
    // set edit component fields to component values
    $("#edit_comp_name").val(name);
    $("#edit_comp_variable").val(variable);
    $("#edit_comp_label").val(label);
    $("#edit_comp_fun").val(fun);
  }
}

// hoverIn is the hover in method for objects, sets colors
Raphael.fn.hoverIn=function(){
  var tiptxt, i1, i2, id, nc=ns_nc().nc, il=inputs.length;
  // if the object is not a label
  if(this.type!='text'){
    // build element info text
    tiptxt="<table><tr><td>Name:</td><td>"+this.data("name")+"</td></tr>";
    tiptxt+="<tr><td>Variable:</td><td>"+this.data("variable")+"</td></tr>";
    tiptxt+="<tr><td>Label:</td><td>"+this.data("label")+"</td></tr>";
    // if the object is an input
    if(this.type=="ellipse"){
      // get the input id
      id=varID(inputs, this.data("variable"));
      // add nominal and random uncertainty value to element info
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(this.data("nominal"))
        +"</td></tr>";
      tiptxt+="<tr><td>Random:</td><td>"+engFormat(this.data("random"))
        +"</td></tr>";
      // if correlation view is set
      if(flags.cor){
        // get the number of correlations
        ncl=nc.length;
        // loop through all correlations
        for(i1=0; i1<ncl; i1++){
          // if value from the correlation matrix is nonzero for the particular
          // input
          if(nc[i1][id]!=0){
            // loop throgh all inputs
            for(i2=0; i2<il; i2++){
              // if value from the correlation matrix is nonzero
              if(nc[i1][i2]!=0){
                // set input color to blue
                inputs[i2].attr({stroke:"#002B80", fill:"#CCDDFF"});
              }
            }
          }
        }
      }
    // if the object is a component
    } else if(this.type=="rect"){
      // add function and nominal value to element info
      tiptxt+="<tr><td>Function:</td><td>"+this.data("fun")+"</td></tr>";
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(this.data("nominal"))+
        "</td></tr>";
      // if component total uncertainty value is calculated
      if(flags.U){
        // get the component id
        id=varID(components, this.data("variable"));
        // add component total, and percent uncertainty value to element info
        tiptxt+="<tr><td>Uncertainty:</td><td>"+engFormat(U[id])+"</td></tr>";
        tiptxt+="<tr><td>% Uncertainty:</td><td>"+(100*U[id]/Math.abs(Number(
          this.data("nominal")))).toFixed(2)+"%</td></tr>";
      }
    }
    // finish up element info table
    tiptxt+="</table>";
    // if element info view is on
    if(flags.info){
      // set element info css so that it is visible and positioned correctly
      $("#tip").css("display", "inline");
      $("#tip").css("left", event.clientX+20).css("top", event.clientY+20);
      $("#tip").append(tiptxt);
    }
    // set object color to yellow
    this.attr({stroke:"#999900", fill:"#FFFFE5"});
    // if backward dependencies view is on, color all before objects
    if(flags.before){before_obj(this.data("variable"));}
    // if forward dependencies view is on, color all after objects
    if(flags.after){after_obj(this.data("variable"));}
  // if the object is a label
  } else {
    // get the input id of the label
    id=varID(inputs, this.data("variable"));
    // if the label is for an input
    if(id!==false){
      // build element info text
      tiptxt="<table><tr><td>Name:</td><td>"+inputs[id].data("name")+
        "</td></tr>";
      tiptxt+="<tr><td>Variable:</td><td>"+inputs[id].data("variable")+
        "</td></tr>";
      tiptxt+="<tr><td>Label:</td><td>"+inputs[id].data("label")+"</td></tr>";
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(inputs[id].data("nominal"))
        +"</td></tr>";
      tiptxt+="<tr><td>Random:</td><td>"+engFormat(inputs[id].data("random"))
        +"</td></tr>";
      // set input color
      inputs[id].attr({stroke:"#999900", fill:"#FFFFE5"});
      // if correlation view is set
      if(flags.cor){
        // get the number of correlations
        ncl=nc.length;
        // loop through all correlations
        for(i1=0; i1<ncl; i1++){
          // if value from the correlation matrix is nonzero for the particular
          // input
          if(nc[i1][id]!=0){
            // loop throgh all inputs
            for(i2=0; i2<il; i2++){
              // if value from the correlation matrix is nonzero
              if(nc[i1][i2]!=0 && i2!=id){
                // set input color to blue
                inputs[i2].attr({stroke:"#002B80", fill:"#CCDDFF"});
              }
            }
          }
        }
      }
    // if the label is for a component
    } else {
      // get the component id of the label
      id=varID(components, this.data("variable"));
      // buld element info text
      tiptxt="<table><tr><td>Name:</td><td>"+components[id].data("name")+
        "</td></tr>";
      tiptxt+="<tr><td>Variable:</td><td>"+components[id].data("variable")+
        "</td></tr>";
      tiptxt+="<tr><td>Label:</td><td>"+components[id].data("label")+
        "</td></tr>";
      tiptxt+="<tr><td>Function:</td><td>"+components[id].data("fun")+
        "</td></tr>";
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(
        components[id].data("nominal"))+"</td></tr>";
      // if component total uncertainty value is calculated
      if(flags.U){
        // add component total, and percent uncertainty value to element info
        tiptxt+="<tr><td>Uncertainty:</td><td>"+engFormat(U[id])+"</td></tr>";
        tiptxt+="<tr><td>% Uncertainty:</td><td>"+(100*U[id]/Math.abs(Number(
          components[id].data("nominal")))).toFixed(2)+"%</td></tr>";
      }
      // set component color to yellow
      components[id].attr({stroke:"#999900", fill:"#FFFFE5"});
    }
    // finish up element info table
    tiptxt+="</table>";
    // if element info view is on
    if(flags.info){
      // set element info css so that it is visible and positioned correctly
      $("#tip").css("display", "inline");
      $("#tip").css("left", event.clientX+20).css("top", event.clientY+20);
      $("#tip").append(tiptxt);
    }
    // if backward dependencies view is on, color all before objects
    if(flags.before){before_obj(this.data("variable"));}
    // if forward dependencies view is on, color all after objects
    if(flags.after){after_obj(this.data("variable"));}
  }
}

// hoverOut is the hover out method for objects, resets colors
Raphael.fn.hoverOut=function(){
  var li;
  // if the object is not a label
  if(this.type!='text'){
    // set color back to black and whaite
    this.attr({stroke:"#000000", fill:"#ffffff"});
  // if the object is a label
  } else {
    // get the input id of the label
    li=varID(inputs, this.data("variable"));
    // if the input id of the label exists
    if(li!==false){
      // set input color back to black and white
      inputs[li].attr({stroke:"#000000", fill:"#ffffff"});
    // if the input id of the label does not exist, its a component label
    } else {
      // get the component id of the label
      li=varID(components, this.data("variable"));
      // set component color back to black and white
      components[li].attr({stroke:"#000000", fill:"#ffffff"});
    }
  }
  // set all before, after, or correlation view colors back to black and white
  reset_obj_color();
  // empty and hide the element info
  $("#tip").empty();
  $("#tip").css("display", "none");
}

// onend is the on end method for objects
Raphael.fn.onend=function(){
  var hw=$("#holder").width(), hh=$("#holder").height(), obb=this.getBBox();
  var att, ox, oy, li;
  // if the object is an input
  if(this.type=="ellipse"){
    // get the input id
    li=varID(inputs,this.data("variable"));
    // get the x, and y of the input
    ox=this.attr("cx");
    oy=this.attr("cy");
    // set the initial x and y
    att={cx: ox, cy: oy};
    // update the input label x, and y
    input_labels[li].attr({x: att.cx, y: att.cy});
    input_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=
      svg_label(this.data("label"));
    input_labels[li].node.getElementsByTagName("tspan")[0].setAttribute(
      "dy", "3.5");
  // if the object is a component
  } else if(this.type == "rect"){
    // get the component id
    li=varID(components, this.data("variable"));
    // get the x and y of the component
    ox=this.attr("x");
    oy=this.attr("y");
    // set the initial x, and y
    att={x: ox, y: oy};
    // update the component label x, and y
    component_labels[li].attr({x: att.x+this.ow/2, y: att.y+this.oh/2});
    component_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=
      svg_label(this.data("label"));
    component_labels[li].node.getElementsByTagName("tspan")[0].setAttribute(
      "dy", "3.5");
  }
  // update the objects x, and y
  this.attr(att);
  // for each connection, update the connection as objects move
  for(i=connections.length; i--;){r.connection(connections[i]);}
}

// onmove is the on move method for objects
Raphael.fn.onmove=function(dx, dy){
  var att, i, li;
  // if object is an input
  if(this.type=="ellipse"){
    // get the input id
    li=varID(inputs,this.data("variable"));
    // get object x, and y and add mouse movement divided by zoom amount
    att={cx: this.ox+(dx)/zoom, cy: this.oy+(dy)/zoom};
    // update the input label x, and y
    input_labels[li].attr({x: this.ox+(dx)/zoom, y: this.oy+(dy)/zoom});
    input_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=
      svg_label(this.data("label"));
    input_labels[li].node.getElementsByTagName("tspan")[0].setAttribute(
      "dy", "3.5");
  // if object is a component
  } else if(this.type=="rect"){
    // get the component id
    li=varID(components,this.data("variable"));
    // get object x, and y and add mouse movement divided by zoom amount
    att={x: this.ox+(dx)/zoom, y: this.oy+(dy)/zoom};
    // update the component label x, and y
    component_labels[li].attr({x: this.ox+this.ow/2+(dx)/zoom,
      y: this.oy+this.oh/2+(dy)/zoom});
    component_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=
      svg_label(this.data("label"));
    component_labels[li].node.getElementsByTagName("tspan")[0].setAttribute(
      "dy", "3.5");
  }
  // update the objects x, and y
  this.attr(att);
  // for each connection, update the connections as objects move
  for(i=connections.length; i--;){r.connection(connections[i]);}
  // update the element info position
  $("#tip").css("left", event.clientX+20).css("top", event.clientY+20);
  // fix for safari
  //r.safari();
}

// onstart is the on start method for objects
Raphael.fn.onstart=function(){
  // if the object is an input
  if(this.type=="rect"){
    // get the input x, and y
    this.ox=this.attr("x");
    this.oy=this.attr("y");
  // if the object is a component
  } else {
    // get the component x, and y
    this.ox=this.attr("cx");
    this.oy=this.attr("cy");
  }
  // get the object width, and height
  this.ow=this.getBBox().width;
  this.oh=this.getBBox().height;
}

//****************************************************************************//
//                                                                            //
//                           Build Dialog Functions                           //
//                                                                            //
//****************************************************************************//
// These functions build the various dialog content.                          //
//****************************************************************************//

//****************************** Action dialogs ******************************//

// build_ds_dialog builds the dialog content for the dataset dialog
function build_ds_dialog(){
  var i, dsl=datasets.length, n, mean, stdev, style;
  // define common css style
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add form tags
  $("#ds_dialog").append("<form></form>");
  // add input tag for Add Dataset
  $("#ds_dialog form").append("<input id='add_ds' name='add_ds' type='button' \
    value='Add Dataset'>");
  // add table, tbody, and first row tags
  $("#ds_dialog form").append("<table></table>");
  $("#ds_dialog form table").append("<tbody></tbody>");
  $("#ds_dialog form table tbody").append("<tr></tr>");
  // if no datasets added yet
  if(dsl==0){
    // state no datasets have been added yet
    $("#ds_dialog form table tbody tr:last-child").append("No datasets have \
      been added yet. Please add a dataset.");
  // if datasets have been added
  } else {
    // add column headers for dataset info
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>id</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>Number</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>Mean</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>StDev</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'></th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'></th>");
    // for each dataset that has been added
    for(i=0; i<dsl; i++){
      // calculate N, mean, and standard deviation of dataset
      n=num_samples(datasets[i].values);
      mean=mu(datasets[i].values);
      stdev=sig(datasets[i].values, mean);
      // add dataset information to dialog
      $("#ds_dialog form table tbody").append("<tr></tr>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='\
        word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='\
        word-wrap: break-word; "+style+"'>"+datasets[i].name+"</td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='\
        word-wrap: break-word; "+style+"'>"+n+"</td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='\
        word-wrap: break-word; "+style+"'>"+engFormat(mean)+"</td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='\
        word-wrap: break-word; "+style+"'>"+engFormat(stdev)+"</td>");
      // add edit and delete dataset link
      $("#ds_dialog form table tbody tr:last-child").append("<td style='\
        word-wrap: break-word; "+style+"'><a href='' id='edit_ds_"+i+"''>Edit\
        </a></td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='\
        word-wrap: break-word; "+style+"'><a href='' id='del_ds_"+i+"'>Delete\
        </a></td>");
      // add edit dataset click event
      $("#edit_ds_"+i).click(function(){
        // get id of dataset clicked
        ds_edit=Number($(this).attr('id').split("_")[2]);
        // open edit dataset dialog
        edit_ds_dialog.dialog("open");
        // add edit dataset data click event
        $("#edit_ds_data").click(function(){
          // add input tag to body to open CSV file of data
          $("body").append("<input id='file_open' type='file' accept='.csv, \
            .txt' style='display:none;'>");
          // trigger click of file open input tag
          $("#file_open").trigger('click');
          // on change of file open input tag
          document.getElementById('file_open').addEventListener('change',
            function(event){
            // process file
            var files=event.target.files;
            var file=files[0];
            var reader=new FileReader();
            reader.readAsText(file);
            reader.onload=function(){
              // file contents as string
              data_str=reader.result;
              // change string to array
              var data_arr=ds_str_2_arr(data_str);
              // calculate N, mean, and standard deviation of file data
              var num=num_samples(data_arr);
              var mean=mu(data_arr);
              var stdev=sig(data_arr, mean);
              // error check file data
              if(isNaN(num) || isNaN(mean) || isNaN(stdev)){
                $("#edit_ds_data_txt").text("Data is not valid.");
                ds_valid=false;
              // if no errors
              } else {
                // display N, mean, and standard deviation of file data
                $("#edit_ds_data_txt").text("Data has been added. N="+num+
                  ", mu="+engFormat(mean)+", sig="+engFormat(stdev));
                ds_valid=true;
              }
            };
            // remove file open input tag
            $("#file_open").remove();
          }, false);
          event.preventDefault();
        });
        event.preventDefault();
      });
      // add delete dataset click event
      $("#del_ds_"+i).click(function(){
        // get id of dataset clicked
        ds_del=Number($(this).attr('id').split("_")[2]);
        // open delete dataset dialog
        del_ds_dialog.dialog("open");
        event.preventDefault();
      });
    }
  }
  // add add dataset click event
  $("#add_ds").click(function(){
    // open add dataset dialog
    add_ds_dialog.dialog("open");
    // add add dataset data click event
    $("#add_ds_data").click(function(){
      // add input tag to body to open CSV file of data
      $("body").append("<input id='file_open' type='file' accept='.csv, \
        .txt' style='display:none;'>");
      // tigger click of file open input tag
      $("#file_open").trigger('click');
      // on change of file open input tag
      document.getElementById('file_open').addEventListener('change',
        function(event){
        // process file
        var files=event.target.files;
        var file=files[0];
        var reader=new FileReader();
        reader.readAsText(file);
        reader.onload=function(){
          // file contents as string
          data_str=reader.result;
          // change string to array
          var data_arr=ds_str_2_arr(data_str);
          // calculate N, mean, and standard deviation of file data
          var num=num_samples(data_arr);
          var mean=mu(data_arr);
          var stdev=sig(data_arr, mean);
          // error check file data
          if(isNaN(num) || isNaN(mean) || isNaN(stdev)){
            $("#add_ds_data_txt").text("Data is not valid.");
            ds_valid=false;
          // if no errors
          } else {
            // display N, mean, and standard devation of file data
            $("#add_ds_data_txt").text("Data has been added. N="+num+
              ", mu="+engFormat(mean)+", sig="+engFormat(stdev));
            ds_valid=true;
          }
        };
        // remove file open input tag
        $("#file_open").remove();
      }, false);
      event.preventDefault();
    });
  });
  // resize dataset dialog to fit all new content
  resize($("#ds_dialog"));
}

// build_src_dialog builds the dialog content for the source dialog
function build_src_dialog(){
  var i, srcl=sources.length, style;
  // define common css style
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add form tags
  $("#src_dialog").append("<form></form>");
  // add input tag for Add Source
  $("#src_dialog form").append("<input id='add_src' name='add_src' type=\
    'button' value='Add Source'>");
  // add table, tbody, and first row tags
  $("#src_dialog form").append("<table></table>");
  $("#src_dialog form table").append("<tbody></tbody>");
  $("#src_dialog form table tbody").append("<tr></tr>");
  // if no sources added yet
  if(srcl==0){
    // state no sources have been added yet
    $("#src_dialog form table tbody tr:last-child").append("No sources have \
      been added yet. Please add a sources.");
  // if sources have been added
  } else {
    // add column headers for source info
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>id</th>");
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Value</th>");
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'></th>");
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'></th>");
    // for each source that has been added
    for(i=0; i<srcl; i++){
      // add source information to dialog
      $("#src_dialog form table tbody").append("<tr></tr>");
      $("#src_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#src_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+sources[i].name+"</td>");
      $("#src_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(sources[i].value)+
        "</td>");
      // add edit and delete source link
      $("#src_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'><a href='' id='edit_src_"+i+"''>Edit\
        </a></td>");
      $("#src_dialog form table tbody tr:last-child").append("<td style='\
        word-wrap: break-word; "+style+"'><a href='' id='del_src_"+i+"'>Delete\
        </a></td>");
      // add edit source click event
      $("#edit_src_"+i).click(function(){
        // get id of source clicked
        src_edit=Number($(this).attr('id').split("_")[2]);
        console.log(src_edit);
        // open edit source dialog
        edit_src_dialog.dialog("open");
        event.preventDefault();
      });
      // add delete source click event
      $("#del_src_"+i).click(function(){
        // get id of source clicked
        src_del=Number($(this).attr('id').split("_")[2]);
        // open delete source dialog
        del_src_dialog.dialog("open");
        event.preventDefault();
      });
    }
  }
  // resize source dialog to fit all new content
  resize($("#src_dialog"));
}

// build_inp_dialog builds the dialog content for the input dialog
function build_inp_dialog(){
  var i1, i2, il=inputs.length, mess="", sl, ns=ns_nc().ns, style;
  // define common css style
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add form tags
  $("#inp_dialog").append("<form></form>");
  // add input tag for Add Input
  $("#inp_dialog form").append("<input id='add_inp' name='add_inp' type=\
    'button' value='Add Input'>");
  // add table, tbody, and first row tags
  $("#inp_dialog form").append("<table></table>");
  $("#inp_dialog form table").append("<tbody></tbody>");
  $("#inp_dialog form table tbody").append("<tr></tr>");
  // if no inputs added yet
  if(il==0){
    // state no inputs have been added yet
    $("#inp_dialog form table tbody tr:last-child").append("No inputs have been\
    added yet. Please add an input.");
  // if inputs have been added
  } else {
    // add column headers for input info
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>id</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Variable</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Label</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Nominal</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Random</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Systematic Src Id(s)</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Systematic</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'></th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'></th>");
    // for each input that has been added
    for(i1=0; i1<il; i1++){
      // add input information to dialog
      $("#inp_dialog form table tbody").append("<tr></tr>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+(i1+1)+"</td>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+inputs[i1].data("name")+"</td>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+inputs[i1].data("variable")+
        "</td>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+inputs[i1].data("label")+"</td>");
      // if nominal value comes from dataset, add which dataset
      if(inputs[i1].data("nom_ds")>=0){
        $("#inp_dialog form table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>"+engFormat(
            inputs[i1].data("nominal"))+" (ds "+(inputs[i1].data("nom_ds")+1)+
          ")</td>");
      // if nominal value does not come from dataset, simply add nominal value
      } else {
        $("#inp_dialog form table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>"+engFormat(
            inputs[i1].data("nominal"))+"</td>");
      }
      // if random uncertainty value comes from dataset, add which dataset
      if(inputs[i1].data("rand_ds")>=0){
        $("#inp_dialog form table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>"+engFormat(
          inputs[i1].data("random"))+" (ds "+(inputs[i1].data("rand_ds")+1)+
          ")</td>");
      // if random uncertainty value does not come from dataset, simply add
      // random uncertainty value
      } else {
        $("#inp_dialog form table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>"+engFormat(
          inputs[i1].data("random"))+"</td>");
      }
      // if no systematic uncertainty sources, add zero value
      if(inputs[i1].data("sys_src").length==0){
        $("#inp_dialog form table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>0</td>");
      // if systematic uncertainty sources are assigned, build content
      } else {
        // get the number of systematic uncertainty sources
        sl=inputs[i1].data("sys_src").length;
        // if the number of sources is one, add the source value
        if(sl==1){
          $("#inp_dialog form table tbody tr:last-child").append("<td style=\
            'word-wrap: break-word; "+style+"'>"+inputs[i1].data("sys_src")[0]+
            "</td>");
        // if the number of sources is greater than one, add all the sources
        } else {
          mess="";
          for(i2=0; i2<sl-1; i2++){
            mess+=inputs[i1].data("sys_src")[i2]+", ";
          }
          mess+=" and "+inputs[i1].data("sys_src")[sl-1];
          $("#inp_dialog form table tbody tr:last-child").append("<td style=\
            'word-wrap: break-word; "+style+"'>"+mess+"</td>");
        }
      }
      // add uncorrelated systematic uncertainty value to dialog
      $("#inp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(ns[i1])+"</td>");
      // add edit and delete links
      $("#inp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'><a href='' id='edit_inp_"+i1+"''>\
        Edit</a></td>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'><a href='' id='del_inp_"+i1+"'>\
        Delete</a></td>");
      // add edit input click event
      $("#edit_inp_"+i1).click(function(){
        // get id of input clicked
        inp_edit=Number($(this).attr('id').split("_")[2]);
        // open edit input dialog
        edit_inp_dialog.dialog("open");
        event.preventDefault();
      });
      // add delete input click event
      $("#del_inp_"+i1).click(function(){
        var i3, boo=false, cl=components.length;
        // get id of input clicked
        inp_del=Number($(this).attr('id').split("_")[2]);
        // check if input is a dependency
        for(i3=0; i3<cl; i3++){
          if($.inArray(inputs[inp_del].data("variable"),
            get_dep(components[i3].data("fun")))>=0){
            $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
            Cannot delete input "+(inp_del+1)+" ("+inputs[inp_del].data("name")
            +") because a component is dependent upon it.</p></div>");
            $(function(){
              $("#warn").dialog({
                modal: true,
                width: '300px',
                buttons: {
                  Ok: function(){
                    $(this).dialog("close");
                    $("#warn").remove();
                  }
                }
              });
            });
            i3=cl;
            boo=true;
          }
        }
        // if input is not a dependency, open delete input dialog
        if(!boo){del_inp_dialog.dialog("open");}
        event.preventDefault();
      });
    }
  }
  // resize input dialog to fit all new content
  resize($("#inp_dialog"));
}

// build_comp_dialog builds the dialog content for the component dialog
function build_comp_dialog(){
  var i1, cl=components.length, style;
  // define common css style
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add form tags
  $("#comp_dialog").append("<form></form>");
  // add input tags for Add Component
  $("#comp_dialog form").append("<input id='add_comp' name='add_comp' type=\
    'button' value='Add Component'>");
  // add table, tbody, and first row tags
  $("#comp_dialog form").append("<table></table>");
  $("#comp_dialog form table").append("<tbody></tbody>");
  $("#comp_dialog form table tbody").append("<tr></tr>");
  // if no components added yet
  if(cl==0){
    // state no components have been added yet
    $("#comp_dialog form table tbody tr:last-child").append("No components have\
      been added yet. Please add a component.");
  // add column header for component info
  } else{
    $("#comp_dialog form table tbody tr:last-child").append("<th style=\
      'padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style=\
      'padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style=\
      'padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style=\
      'padding: 5px; text-decoration: underline; "+style+"'>Label</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style=\
      'padding: 5px; text-decoration: underline; "+style+"'>Function</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style=\
      'padding: 5px; text-decoration: underline; "+style+"'>Nominal</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style=\
      'padding: 5px; text-decoration: underline; "+style+"'></th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style=\
      'padding: 5px; text-decoration: underline; "+style+"'></th>");
    // for each component that has been added
    for(i1=0; i1<cl; i1++){
      // add component information to dialog
      $("#comp_dialog form table tbody").append("<tr></tr>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+(i1+1)+"</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+components[i1].data("name")+
        "</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+components[i1].data("variable")+
        "</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+components[i1].data("label")+
        "</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+components[i1].data("fun")+
        "</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(
        components[i1].data("nominal"))+"</td>");
      // add edit and delete links
      $("#comp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'><a href='' id='edit_comp_"+i1+"''>\
        Edit</a></td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'><a href='' id='del_comp_"+i1+"'>\
        Delete</a></td>");
      // add edit component click event
      $("#edit_comp_"+i1).click(function(){
        // get id of component clicked
        comp_edit=Number($(this).attr('id').split("_")[2]);
        // open edit component dialog
        edit_comp_dialog.dialog("open");
        event.preventDefault();
      });
      // add delete component click event
      $("#del_comp_"+i1).click(function(){
        // check if component is dependency
        var i2, boo=false, cl=components.length;
        comp_del=Number($(this).attr('id').split("_")[2]);
        for(i2=0; i2<cl; i2++){
          if($.inArray(components[comp_del].data("variable"),
            get_dep(components[i2].data("fun")))>=0){
            $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
            Cannot delete component "+(comp_del+1)+" ("+
              components[comp_del].data("name")+") because another component is\
              dependent upon it.</p></div>");
            $(function(){
              $("#warn").dialog({
                modal: true,
                width: '300px',
                buttons: {
                  Ok: function(){
                    $(this).dialog("close");
                    $("#warn").remove();
                  }
                }
              });
            });
            i2=cl;
            boo=true;
          }
        }
        // if component is not dependency, open delete component dialog
        if(!boo){del_comp_dialog.dialog("open");}
        event.preventDefault();
      });
    }
  }
  // resize component dialog to fit all new content
  resize($("#comp_dialog"));
}

//******************************* Add dialogs ********************************//

// build_add_ds_dialog builds the dialog content for the add dataset dialog
function build_add_ds_dialog(){
  // add All Fields Required
  $("#add_ds_dialog").append("<p>All Fields Required</p>");
  // add form tags
  $("#add_ds_dialog").append("<form></form>");
  // add input tags for dataset information
  $("#add_ds_dialog form").append("<label for='add_ds_name'>Name:</label>");
  $("#add_ds_dialog form").append("<input id='add_ds_name' name='add_ds_name' \
    type='text' class='text ui-widget-content ui-corner-all'>");
  $("#add_ds_dialog form").append("<label for='add_ds_data'>Data:</label>");
  // add tag for applying a CSV file to the dataset
  $("#add_ds_dialog form").append("<input id='add_ds_data' name='add_ds_data' \
    type='button' value='CSV'>");
  $("#add_ds_dialog form").append("<div id='add_ds_data_txt'>No data has been \
    added yet.</div>");
}

// build_add_src_dialog builds the dialog content for the add source dialog
function build_add_src_dialog(){
  // add All Fields Required
  $("#add_src_dialog").append("<p>All Fields Required</p>");
  // add form tags
  $("#add_src_dialog").append("<form></form>");
  // add input tags for source information
  $("#add_src_dialog form").append("<label for='add_src_name'>Name:</label>");
  $("#add_src_dialog form").append("<input id='add_src_name' name=\
    'add_src_name' type='text' class='text ui-widget-content ui-corner-all'>");
  $("#add_src_dialog form").append("<label for='add_src_value'>Value:</label>");
  $("#add_src_dialog form").append("<input id='add_src_value' name=\
    'add_src_value' type='text' class='text ui-widget-content ui-corner-all'>");
}

// build_add_inp_dialog builds the dialog content for the add input dialog
function build_add_inp_dialog(){
  // add All Fields Required
  $("#add_inp_dialog").append("<p>All Fields Required</p>");
  // add form tags
  $("#add_inp_dialog").append("<form></form>");
  // add input tags for input information
  $("#add_inp_dialog form").append("<label for='add_inp_name'>Name:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_name' name=\
    'add_inp_name'>");
  $("#add_inp_dialog form").append("<label for='add_inp_variable'>Variable:\
    </label>");
  $("#add_inp_dialog form").append("<input id='add_inp_variable' name=\
    'add_inp_variable'>");
  $("#add_inp_dialog form").append("<label for='add_inp_label'>Label:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_label' name=\
    'add_inp_label'>");
  $("#add_inp_dialog form").append("<label for='add_inp_nominal'>Nominal Value:\
    </label><br>");
  $("#add_inp_dialog form").append("<input id='add_inp_nominal' name=\
    'add_inp_nominal' style='width: 44%;'>");
  $("#add_inp_dialog form").append(" or ");
  // add input tag to apply dataset to nominal value
  $("#add_inp_dialog form").append("<input id='add_inp_nominal_ds' name='Data' \
    value='Use Dataset' style='width: 44%;'><br>");
  $("#add_inp_dialog form").append("<label for='add_inp_random'>Random \
    Uncertainty:</label><br>");
  $("#add_inp_dialog form").append("<input id='add_inp_random' for=\
    'add_inp_random' style='width: 44%;'>");
  $("#add_inp_dialog form").append(" or ");
  // add input tag to apply dataset to random uncertainty value
  $("#add_inp_dialog form").append("<input id='add_inp_random_ds' name='Data' \
    value='Use Dataset' style='width: 44%;'><br>");
  $("#add_inp_dialog form").append("<label for='add_inp_systematic'>Systematic \
    Uncertainty Sources:</label>");
  // add input tag to apply source to systematic uncertainty value
  $("#add_inp_dialog form").append("<input id='add_inp_systematic_src' name=\
    'Data' value='Select Source(s)'><br>");
  $("#add_inp_dialog form").append("<div id='src_select'>No sources have been \
    selected. If no source(s) are selected, a value of zero will be used.\
    </div>");
  $("#add_inp_dialog form input").attr("type", "text");
  $("#add_inp_dialog form input").attr("class", "text ui-widget-content \
    ui-corner-all");
  // set input tags for apply dataset to nominal, and random and for apply
  // sources to systematic to button
  $("#add_inp_nominal_ds, #add_inp_random_ds, #add_inp_systematic_src")
    .attr("type", "button");
  // change class type of the apply buttons so they format correctly
  $("#add_inp_nominal_ds, #add_inp_random_ds, #add_inp_systematic_src")
    .attr("class", "");
  // add click event to apply dataset to nominal value
  $("#add_inp_nominal_ds").click(function(){
    // if no datasets have been added, warn and ask to add dataset
    if(datasets.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Datasets \
        Available'><p>No datasets available. Please add a dataset.</p><input \
        id='warn_add' type='button' value='Got To Add Dataset'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Datasets").click();
      });
    // if datasets have been added, open apply dataset to nominal dialog
    } else {
      apply_ds_2_nom_dialog.dialog("open");
    }
  });
  // add click event to apply dataset to random value
  $("#add_inp_random_ds").click(function(){
    // if no datasets have been added, warn and ask to add dataset
    if(datasets.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Datasets \
        Available'><p>No datasets available. Please add a dataset.</p><input \
        id='warn_add' type='button' value='Go To Add Dataset'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Datasets").click();
      });
    // if datasets have been added, open apply dataset to random dialog
    } else {
      apply_ds_2_rand_dialog.dialog("open");
    }
  });
  // add click event to apply source to systematic value
  $("#add_inp_systematic_src").click(function(){
    // if no sources have been added, warn and ask to add source
    if(sources.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Sources \
        Available'><p>No sources available. Please add a source.</p><input \
        id='warn_add' type='button' value='Go To Add Source'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Sources").click();
      });
    // if sources have been added, open apply source to systematic dialog
    } else {
      apply_src_2_sys_dialog.dialog("open");
    }
  });
}

// build_add_comp_dialog builds the dialog content for the add component dialog
function build_add_comp_dialog(){
  // add All Fields Required
  $("#add_comp_dialog").append("<p>All Fields Required</p>");
  // add form tags
  $("#add_comp_dialog").append("<form></form>");
  // add input tags for component information
  $("#add_comp_dialog form").append("<label for='add_comp_name'>Name:</label>");
  $("#add_comp_dialog form").append("<input id='add_comp_name' name=\
    'add_comp_name'>");
  $("#add_comp_dialog form").append("<label for='add_comp_variable'>Variable:\
    </label>");
  $("#add_comp_dialog form").append("<input id='add_comp_variable' name=\
    'add_comp_variable'>");
  $("#add_comp_dialog form").append("<label for='add_comp_label'>Label:\
    </label>");
  $("#add_comp_dialog form").append("<input id='add_comp_label' name=\
    'add_comp_label'>");
  $("#add_comp_dialog form").append("<label for='add_comp_fun'>Function:\
    </label><br>");
  $("#add_comp_dialog form").append("<input id='add_comp_fun' name=\
    'add_comp_fun'>");
  $("#add_comp_dialog form input").attr("type", "text");
  $("#add_comp_dialog form input").attr("class", "text ui-widget-content \
    ui-corner-all");
}

//******************************* Edit dialogs *******************************//

// build_edit_ds_dialog builds the dialog content for the edit dataset dialog
function build_edit_ds_dialog(){
  var n, mean, stdev;
  // calculate the dataset N, mean, and standard deviation
  n=num_samples(datasets[ds_edit].values);
  mean=mu(datasets[ds_edit].values);
  stdev=sig(datasets[ds_edit].values, mean);
  // add All Fields Required
  $("#edit_ds_dialog").append("<p>All Fields Required</p>");
  // add form tags
  $("#edit_ds_dialog").append("<form></form>");
  // add input tags for dataset information
  $("#edit_ds_dialog form").append("<label for='edit_ds_name'>Name:</label>");
  $("#edit_ds_dialog form").append("<input id='edit_ds_name' name=\
    'edit_ds_name' type='text' class='text ui-widget-content ui-corner-all'>");
  $("#edit_ds_dialog form").append("<label for='edit_ds_data'>Data:</label>");
  // add tag for applying a CSV file to the dataset
  $("#edit_ds_dialog form").append("<input id='edit_ds_data' name=\
    'edit_ds_data' type='button' value='CSV'>");
  // set text to dataset N, mean, and standard deviation value
  $("#edit_ds_dialog form").append("<div id='edit_ds_data_txt'>Data has been \
    added. N="+n+", mu="+mean+", sig="+stdev+"</div>");
  // set dialog fields to dataset values
  $("#edit_ds_name").val(datasets[ds_edit].name);
  data_str=datasets[ds_edit].values.join("\n");
  ds_valid=true;
}

// build_edit_src_dialog builds the dialog content for the edit source dialog
function build_edit_src_dialog(){
  // add All Fields Required
  $("#edit_src_dialog").append("<p>All Fields Required</p>");
  // add form tags
  $("#edit_src_dialog").append("<form></form>");
  // add input tags for source information
  $("#edit_src_dialog form").append("<label for='edit_src_name'>Name:</label>");
  $("#edit_src_dialog form").append("<input id='edit_src_name' name=\
    'edit_src_name' type='text' class='text ui-widget-content ui-corner-all'>");
  $("#edit_src_dialog form").append("<label for='edit_src_value'>Value:\
    </label>");
  $("#edit_src_dialog form").append("<input id='edit_src_value' name=\
    'edit_src_value' type='text' class='text ui-widget-content \
    ui-corner-all'>");
  // set dialog fields to source values
  $("#edit_src_name").val(sources[src_edit].name);
  $("#edit_src_value").val(sources[src_edit].value);
}

// build_edit_inp_dialog builds the dialog content for the edit input dialog
function build_edit_inp_dialog(){
  var i, srcl, mess="";
  // add All Fields Required
  $("#edit_inp_dialog").append("<p>All Fields Required</p>");
  // add form tags
  $("#edit_inp_dialog").append("<form></form>");
  // add input tags for input information
  $("#edit_inp_dialog form").append("<label for='edit_inp_name'>Name:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_name' name=\
    'add_inp_name'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_variable'>Variable:\
    </label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_variable' name=\
    'add_inp_variable'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_label'>Label:\
    </label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_label' name=\
    'add_inp_label'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_nominal'>Nominal \
    Value:</label><br>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_nominal' name=\
    'add_inp_nominal' style='width: 44%;'>");
  $("#edit_inp_dialog form").append(" or ");
  // add input tag to apply dataset to nominal value
  $("#edit_inp_dialog form").append("<input id='edit_inp_nominal_ds' name=\
    'Data' value='Use Dataset' style='width: 44%;'><br>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_random'>Random \
    Uncertainty:</label><br>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_random' for=\
    'add_inp_random' style='width: 44%;'>");
  $("#edit_inp_dialog form").append(" or ");
  // add input tag to apply dataset to random uncertainty value
  $("#edit_inp_dialog form").append("<input id='edit_inp_random_ds' name='Data'\
    value='Use Dataset' style='width: 44%;'><br>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_systematic'>\
    Systematic Uncertainty Sources:</label>");
  // add input tag to apply source to systematic uncertainty value
  $("#edit_inp_dialog form").append("<input id='edit_inp_systematic_src' name=\
    'Data' value='Select Source(s)'><br>");
  // get previous systematic sources
  src_sys=inputs[inp_edit].data("sys_src");
  srcl=src_sys.length;
  // if no previous sources, state no sources add
  if(srcl==0){
    $("#edit_inp_dialog form").append("<div id='src_select'>No sources have \
      been selected. If no source(s) are selected, a value of zero will be \
      used.</div>");
  // if one source, state source added
  } else if(srcl==1){
    $("#edit_inp_dialog form").append("<div id='src_select'>Source id "+
      src_sys[0]+" selected.</div>");
  // if multiple sources, state sources
  } else {
    for(i=0; i<srcl-1; i++){mess+=src_sys[i]+", ";}
    mess+=" and "+src_sys[srcl-1];
    $("#edit_inp_dialog form").append("<div id='src_select'>Source ids "+
      mess+" selected.</div>");
  }
  // change class and type of input tags
  $("#edit_inp_dialog form input").attr("type", "text");
  $("#edit_inp_dialog form input").attr("class", "text ui-widget-content \
    ui-corner-all");
  $("#edit_inp_nominal_ds, #edit_inp_random_ds, #edit_inp_systematic_src")
    .attr("type", "button");
  $("#edit_inp_nominal_ds, #edit_inp_random_ds, #edit_inp_systematic_src")
    .attr("class", "");
  // set dialog fields to input values
  $("#edit_inp_name").val(inputs[inp_edit].data("name"));
  $("#edit_inp_variable").val(inputs[inp_edit].data("variable"));
  $("#edit_inp_label").val(inputs[inp_edit].data("label"));
  $("#edit_inp_nominal").val(inputs[inp_edit].data("nominal"));
  ds_nom=inputs[inp_edit].data("nom_ds");
  $("#edit_inp_random").val(inputs[inp_edit].data("random"));
  ds_rand=inputs[inp_edit].data("rand_ds");
  // add click event to apply dataset to nominal value
  $("#edit_inp_nominal_ds").click(function(){
    // if no datasets have been added, warn and ask to add dataset
    if(datasets.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Datasets \
        Available'><p>No datasets available. Please add a dataset.</p><input \
        id='warn_add' type='button' value='Got To Add Dataset'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Datasets").click();
      });
    // if datasets have been added, open apply dataset to nominal dialog
    } else {
      apply_ds_2_nom_dialog.dialog("open");
    }
  });
  // add click event to apply dataset to random value
  $("#edit_inp_random_ds").click(function(){
    // if no datasets have been added, warn and ask to add dataset
    if(datasets.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Datasets \
        Available'><p>No datasets available. Please add a dataset.</p><input \
        id='warn_add' type='button' value='Go To Add Dataset'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Datasets").click();
      });
    // if datasets have been added, open apply dataset to random dialog
    } else {
      apply_ds_2_rand_dialog.dialog("open");
    }
  });
  // add click event to apply sources to systematic uncertainty value
  $("#edit_inp_systematic_src").click(function(){
    // if no sources have been added, warn and ask to add source
    if(sources.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Sources \
        Available'><p>No sources available. Please add a source.</p><input \
        id='warn_add' type='button' value='Go To Add Source'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Sources").click();
      });
    // if sources have been added, open apply sources to systematic dialog
    } else {
      apply_src_2_sys_dialog.dialog("open");
    }
  });
}

// build_edit_comp_dialog builds the dialog content for the edit component
// dialog
function build_edit_comp_dialog(){
  // add All Fields Required
  $("#edit_comp_dialog").append("<p>All Fields Required</p>");
  // add form tags
  $("#edit_comp_dialog").append("<form></form>");
  // add input tags for component information
  $("#edit_comp_dialog form").append("<label for='edit_comp_name'>Name:\
    </label>");
  $("#edit_comp_dialog form").append("<input id='edit_comp_name' name=\
    'add_comp_name'>");
  $("#edit_comp_dialog form").append("<label for='edit_comp_variable'>Variable:\
    </label>");
  $("#edit_comp_dialog form").append("<input id='edit_comp_variable' name=\
    'add_comp_variable'>");
  $("#edit_comp_dialog form").append("<label for='edit_comp_label'>Label:\
    </label>");
  $("#edit_comp_dialog form").append("<input id='edit_comp_label' name=\
    'add_comp_label'>");
  $("#edit_comp_dialog form").append("<label for='edit_comp_fun'>Function:\
    </label><br>");
  $("#edit_comp_dialog form").append("<input id='edit_comp_fun' name=\
    'add_comp_fun'>");
    // change class type of the input tags
  $("#edit_comp_dialog form input").attr("type", "text");
  $("#edit_comp_dialog form input").attr("class", "text ui-widget-content \
    ui-corner-all");
  // set dialog fields to component values
  $("#edit_comp_name").val(components[comp_edit].data("name"));
  $("#edit_comp_variable").val(components[comp_edit].data("variable"));
  $("#edit_comp_label").val(components[comp_edit].data("label"));
  $("#edit_comp_fun").val(components[comp_edit].data("fun"));
}

//****************************** Delete dialogs ******************************//

// build_del_ds_dialog builds the dialog content for the delete dataset dialog
function build_del_ds_dialog(){
  var i1, i2, dep=[], dl, il=inputs.length, mess="";
  // start to build the 'are you sure message'
  mess="Are you sure you want to delete dataset "+(ds_del+1)+" ("+
    datasets[ds_del].name+")?";
  // check to see which inputs are dependent on dataset
  for(i1=0; i1<il; i1++){
    if(ds_del==inputs[i1].data("nom_ds") || ds_del==inputs[i1].data("rand_ds")){
      dep.push(i);
    }
  }
  // if one input dependent on dataset, warn and describe what will happen
  if(dep.length==1){
    mess+=" The input "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+") is \
      dependent upon the dataset. If the dataset is deleted, the input will \
      retain the nominal value, or random uncertainty value that the input \
      current has but will no longer be linked to the dataset.";
  // if more than one input dependent on dataset, warn and describe what will
  // happen
  } else if(dep.length>1){
    dl=dep.length;
    mess+=" The input ";
    for(i2=0; i2<dl-1; i2++){mess+=(dep[i2]+1)+", ";}
    mess+="and "+(dep[dl-1]+1)+" (";
    for(i2=0; i2<dl-1; i2++){mess+=inputs[dep[i2]].data("name")+", ";}
    mess+="and "+inputs[dep[dl-1]].data("name")+") are dependent upon the \
      dataset. If the dataset is deleted, the inputs will retain the nominal \
      value, or random uncertainty value that the inputs currently have but \
      will no longer be linked to the dataset.";
  }
  // add message to dialog
  $("#del_ds_dialog").append("<p>"+mess+"</p>");
  // resize the dialog to fit the message
  resize($("#del_ds_dialog"));
}

// build_del_src_dialog builds the dialog content for the delete source dialog
function build_del_src_dialog(){
  var i1, i2, dep=[], dl, il=inputs.length, mess="";
  // start to build the 'are you sure message'
  mess="Are you sure you want to delete source "+(src_del+1)+" ("+
    sources[src_del].name+")?";
  // check to see which inputs are dependent on source
  for(i1=0; i1<il; i1++){
    if($.inArray(src_del, inputs[i1].data("sys_src"))>=0){dep.push(i);}
  }
  // if one input dependent on source, warn and describe what will happen
  if(dep.length==1){
    mess+=" The input "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+") is \
      dependent upon the source. If the source is deleted, the input will no \
      longer have the systematic uncertainty source which may result in the \
      input having a systematic uncertainty value of zero.";
  // if more than one input dependent on source, warn and describe what will
  // happen
  } else if(dep.length>1){
    dl=dep.length;
    mess+=" The input ";
    for(i2=0; i2<dl-1; i2++){mess+=(dep[i2]+1)+", ";}
    mess+="and "+(dep[dl-1]+1)+" (";
    for(i2=0; i2<dl-1; i2++){mess+=inputs[dep[i2]].data("name")+", ";}
    mess+="and "+inputs[dep[dl-1]].data("name")+") are dependent upon the \
      source. If the source is deleted, the inputs will no longer have the \
      systematic uncertainty source which may result in the inputs having a \
      systematic uncertainty value of zero.";
  }
  // add message to dialog
  $("#del_src_dialog").append("<p>"+mess+"</p>");
  // resize the dialog to fit the message
  resize($("#del_src_dialog"));
}

// build_del_inp_dialog builds the dialog content for the delete input dialog
function build_del_inp_dialog(){
  // add the 'are you sure' message to dialog
  $("#del_inp_dialog").append("<p>Are you sure you want to delete input "+
    (inp_del+1)+" ("+inputs[inp_del].data("name")+")?</p>");
  // resize the dialog to fit the message
  resize($("#del_inp_dialog"));
}

// build_del_comp_dialog builds the dialog content for the delete component
// dialog
function build_del_comp_dialog(){
  // add the 'are you sure' message to dialog
  $("#del_comp_dialog").append("<p>Are you sure you want to delete component "+
    (comp_del+1)+" ("+components[comp_del].data("name")+")?</p>");
  // resize the dialog to fit the message
  resize($("#del_comp_dialog"));
}

//****************************** Apply dialogs *******************************//

// build_apply_ds_2_nom_dialog builds content for the applying dataset to
// nominal value dialog
function build_apply_ds_2_nom_dialog(){
  var i, dsl=datasets.length, style, n, mean, stdev;
  // define common css style
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add form, table, tbody, and first row tags
  $("#apply_ds_2_nom_dialog").append("<form></form>");
  $("#apply_ds_2_nom_dialog form").append("<table></table>");
  $("#apply_ds_2_nom_dialog form table").append("<tbody></tbody>");
  $("#apply_ds_2_nom_dialog form table tbody").append("<tr></tr>");
  // add column headers for dataset info
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style=\
    'padding: 5px; text-decoration: underline; "+style+"'></th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style=\
    'padding: 5px; text-decoration: underline; "+style+"'>id</th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style=\
    'padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style=\
    'padding: 5px; text-decoration: underline; "+style+"'>Number</th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style=\
    'padding: 5px; text-decoration: underline; "+style+"'>Mean</th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style=\
    'padding: 5px; text-decoration: underline; "+style+"'>StDev.</th>");
  // for each dataset
  for(i=0; i<dsl; i++){
    // calculate N, mean, and standard deviation
    n=num_samples(datasets[i].values);
    mean=mu(datasets[i].values);
    stdev=sig(datasets[i].values, mean);
    // add dataset info to dialog
    $("#apply_ds_2_nom_dialog form table tbody").append("<tr></tr>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td \
      style='text-align: center; vertical-align: text-top;'><input type='radio'\
      name='ds' value='"+i+"'</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+datasets[i].name+"</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+n+"</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+engFormat(mean)+"</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+engFormat(stdev)+"</td>");
  }
  // resize dialog to fit dataset info
  resize($("#apply_ds_2_nom_dialog"));
}

// build_apply_ds_2_rand_dialog builds content for the applying dataset to
// random uncertainty value dialog
function build_apply_ds_2_rand_dialog(){
  var i, dsl=datasets.length, style, n, mean, stdev;
  // define common css style
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add form, table, tbody, and first row tags
  $("#apply_ds_2_rand_dialog").append("<form></form>");
  $("#apply_ds_2_rand_dialog form").append("<table></table>");
  $("#apply_ds_2_rand_dialog form table").append("<tbody></tbody>");
  $("#apply_ds_2_rand_dialog form table tbody").append("<tr></tr>");
  // add column headers for dataset info
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'></th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'>Number</th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'>Mean</th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'>StDev.</th>");
  // for each dataset
  for(i=0; i<dsl; i++){
    // calculate N, mean, and standard deviation
    n=num_samples(datasets[i].values);
    mean=mu(datasets[i].values);
    stdev=sig(datasets[i].values, mean);
    // add dataset info to dialog
    $("#apply_ds_2_rand_dialog form table tbody").append("<tr></tr>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td \
      style='text-align: center; vertical-align: text-top;'><input type='radio'\
      name='ds' value='"+i+"'></td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+datasets[i].name+"</td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+n+"</td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+engFormat(mean)+"</td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+engFormat(stdev)+"</td>");
  }
  // resize dialog to fit dataset info
  resize($("#apply_ds_2_rand_dialog"));
}

// build_apply_src_2_sys_dialog builds content for the applying dataset to
// systematic uncertainty source dialog
function build_apply_src_2_sys_dialog(){
  var i, srcl=sources.length, style;
  // define common css style
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add form, table, tbody, and first row tags
  $("#apply_src_2_sys_dialog").append("<form></form>");
  $("#apply_src_2_sys_dialog form").append("<table></table>");
  $("#apply_src_2_sys_dialog form table").append("<tbody></tbody>");
  $("#apply_src_2_sys_dialog form table tbody").append("<tr></tr>");
  // add column headers for source info
  $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'></th>");
  $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
  $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<th \
    style='padding: 5px; text-decoration: underline; "+style+"'>Value</th>");
  // for each source
  for(i=0; i<srcl; i++){
    // add row
    $("#apply_src_2_sys_dialog form table tbody").append("<tr></tr>");
    // if previous sources have been selected, check them
    if(inp_edit!=-1){
      if($.inArray(i+1, inputs[inp_edit].data("sys_src"))>=0){
        $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td\
          style='text-align: center; vertical-align: text-top;'><input type=\
          'checkbox' class='src' name='src' checked></td>");
      } else {
        $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td\
          style='text-align: center; vertical-align: text-top;'><input type=\
          'checkbox' class='src' name='src'></td>");
      }
    } else {
      $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td \
        style='text-align: center; vertical-align: text-top;'><input type=\
        'checkbox' class='src' name='src'></td>");
    }
    // add source info to dialog
    $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
    $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+sources[i].name+"</td>");
    $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td \
      style='word-wrap: break-word; "+style+"'>"+sources[i].value+"</td>");
  }
  // resize dialog to fit source info
  resize($("#apply_src_2_sys_dialog"));
}

//***************************** Summary dialogs ******************************//

// build_sum_ds_dialog builds content for the dataset summary dialog
function build_sum_ds_dialog(){
  var i, dsl=datasets.length, style, n, mean, stdev;
  // define common css style
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add table, tbody, and first row tags
  $("#sum_ds_dialog").append("<table></table>");
  $("#sum_ds_dialog table").append("<tbody></tbody>");
  $("#sum_ds_dialog table tbody").append("<tr></tr>");
  // if no datasets have been added yet, warn no datasets added yet
  if(dsl==0){
    $("body").append("<div id='warn' class='dialog' title='Dataset \
      Summary'><p>No datasets have been added yet.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
    sum_ds_dialog.dialog("close");
  // if datasets have been added
  } else {
    // add column headers for datasets info
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>Number</th>");
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>Mean</th>");
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: \
      5px; text-decoration: underline; "+style+"'>StDev</th>");
    // for each dataset
    for(i=0; i<dsl; i++){
      // calculate N, mean, and standard deviation
      n=num_samples(datasets[i].values);
      mean=mu(datasets[i].values);
      stdev=sig(datasets[i].values, mean);
      // add dataset values
      $("#sum_ds_dialog table tbody").append("<tr></tr>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+datasets[i].name+"</td>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+n+"</td>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(mean)+"</td>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(stdev)+"</td>");
    }
  }
  // resize dialog to fit content
  resize($("#sum_ds_dialog"));
}

// build_sum_src_dialog builds content for the source summary dialog
function build_sum_src_dialog(){
  var i, srcl=sources.length, style;
  // define common css styles
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add table, tbody, and first row tags
  $("#sum_src_dialog").append("<table></table>");
  $("#sum_src_dialog table").append("<tbody></tbody>");
  $("#sum_src_dialog table tbody").append("<tr></tr>");
  // if no sources have been added yet, warn no sources added yet
  if(srcl==0){
    $("body").append("<div id='warn' class='dialog' title='Source \
      Summary'><p>No sources have been added yet.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
    sum_src_dialog.dialog("close");
  // if sources have been added
  } else {
    // add column headers for sources info
    $("#sum_src_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_src_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#sum_src_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Value</th>");
    // for each source
    for(i=0; i<srcl; i++){
      // add source values
      $("#sum_src_dialog table tbody").append("<tr></tr>");
      $("#sum_src_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#sum_src_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+sources[i].name+"</td>");
      $("#sum_src_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(sources[i].value)+
        "</td>");
    }
  }
  // resize dialog to fit content
  resize($("#sum_src_dialog"));
}

// build_sum_inp_dialog builds content for the input summary dialog
function build_sum_inp_dialog(){
  var i1, i2, il=inputs.length, mess="", srcl, ns=ns_nc().ns, style;
  // define common css styles
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add table, tbody, and first row tags
  $("#sum_inp_dialog").append("<table></table>");
  $("#sum_inp_dialog table").append("<tbody></tbody>");
  $("#sum_inp_dialog table tbody").append("<tr></tr>");
  // if no inputs have been added yet, warn no inputs added yet
  if(il==0){
    $("body").append("<div id='warn' class='dialog' title='Input \
      Summary'><p>No inputs have been added yet.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
    sum_inp_dialog.dialog("close");
  // if inputs have been added
  } else {
    // add column headers for inputs info
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Variable</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Label</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Nominal</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Random</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Systematic Src Id(s)</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Systematic</th>");
    // for each input
    for(i1=0; i1<il; i1++){
      // add input values
      $("#sum_inp_dialog table tbody").append("<tr></tr>");
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+(i1+1)+"</td>");
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+inputs[i1].data("name")+"</td>");
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+inputs[i1].data("variable")+
        "</td>");
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+inputs[i1].data("label")+"</td>");
      if(inputs[i1].data("nom_ds")>=0){
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>"+engFormat(
          inputs[i1].data("nominal"))+" (ds "+(inputs[i1].data("nom_ds")+1)+
          ")</td>");
      } else {
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>"+engFormat(
          inputs[i1].data("nominal"))+"</td>");
      }
      if(inputs[i1].data("rand_ds")>=0){
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>"+engFormat(
          inputs[i1].data("random"))+" (ds "+(inputs[i1].data("rand_ds")+1)+
          ")</td>");
      } else {
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>"+engFormat(
          inputs[i1].data("random"))+"</td>");
      }
      if(inputs[i1].data("sys_src").length==0){
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>0</td>");
      } else {
        srcl=inputs[i1].data("sys_src").length;
        if(srcl==1){
          $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
            'word-wrap: break-word; "+style+"'>"+inputs[i1].data("sys_src")[0]+
            "</td>");
        } else {
          mess="";
          for(i2=0; i2<srcl-1; i2++){
            mess+=inputs[i1].data("sys_src")[i2]+", ";
          }
          mess+=" and "+inputs[i1].data("sys_src")[srcl-1];
          $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
            'word-wrap: break-word; "+style+"'>"+mess+"</td>");
        }
      }
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(ns[i1])+"</td>");
    }
  }
  // resize dialog to fit content
  resize($("#sum_inp_dialog"));
}

// build_sum_inp_dialog builds content for the input summary dialog
function build_sum_comp_dialog(){
  var i, cl=components.length, style;
  // define common css styles
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add table, tbody, and first row tags
  $("#sum_comp_dialog").append("<table></table>");
  $("#sum_comp_dialog table").append("<tbody></tbody>");
  $("#sum_comp_dialog table tbody").append("<tr></tr>");
  // if no components have been added yet, warn no components added yet
  if(cl==0){
    $("#sum_comp_dialog table tbody tr:last-child").append("No components have\
      been added yet.");
    $("body").append("<div id='warn' class='dialog' title='Component \
      Summary'><p>No components have been added yet.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
    sum_comp_dialog.dialog("close");
  // if components have been added
  } else {
    // add column headers for components info
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Variable</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Label</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Function</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Nominal</th>");
    // for each component, add component values
    for(i=0; i<cl; i++){
      $("#sum_comp_dialog table tbody").append("<tr></tr>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+components[i].data("name")+
        "</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+components[i].data("variable")+
        "</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+components[i].data("label")+
        "</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+components[i].data("fun")+"</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(
        components[i].data("nominal"))+"</td>");
    }
  }
  // resize dialog to fit content
  resize($("#sum_comp_dialog"));
}

// build_sum_corr_dialog builds content for the correlation summary dialog
function build_sum_corr_dialog(){
  var i1, i2, il=inputs.length, nc=ns_nc().nc, ncs=nc.length, style;
  // define common css styles
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  // add table, tbody, and first row tags
  $("#sum_corr_dialog").append("<table></table>");
  $("#sum_corr_dialog table").append("<tbody></tbody>");
  $("#sum_corr_dialog table tbody").append("<tr></tr>");
  // if no inputs have been added yet, warn no inputs added yet
  if(il==0){
    $("body").append("<div id='warn' class='dialog' title='Correlation \
      Summary'><p>No inputs have been added yet.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
    sum_corr_dialog.dialog("close");
  // if no correlations exist, warn no correlations exist
  } else if(ncs==0){
    $("#sum_corr_dialog table tbody tr:last-child").append("No correlations\
      exit.");
    $("body").append("<div id='warn' class='dialog' title='Correlation \
      Summary'><p>No correlations exist.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
    sum_corr_dialog.dialog("close");
  // if inputs have been added and correlations exist
  } else {
    // add column headers for correlations info
    $("#sum_corr_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_corr_dialog table tbody tr:last-child").append("<th style='padding:\
      5px; text-decoration: underline; "+style+"'>Name</th>");
    for(i1=0; i1<ncs; i1++){
      $("#sum_corr_dialog table tbody tr:last-child").append("<th style=\
        'padding: 5px; text-decoration: underline; "+style+"'>"+(i1+1)+"</th>");
    }
    // for each input, add correlation values
    for(i1=0; i1<il; i1++){
      $("#sum_corr_dialog table tbody").append("<tr></tr>");
      $("#sum_corr_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+(i1+1)+"</td>");
      $("#sum_corr_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+inputs[i1].data("name")+"</td>");
      for(i2=0; i2<ncs; i2++){
        $("#sum_corr_dialog table tbody tr:last-child").append("<td style=\
          'word-wrap: break-word; "+style+"'>"+engFormat(nc[i2][i1])+"</td>");
      }
    }
  }
  // resize dialog to fit content
  resize($("#sum_corr_dialog"));
}

// build_sum_u_dialog builds content for the component total uncertainty
// summary dialog
function build_sum_u_dialog(){
  var i, cl=components.length, style;
  // define common css styles
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  // add table, tbody, and first row tags
  $("#sum_u_dialog").append("<table></table>");
  $("#sum_u_dialog table").append("<tbody></tbody>");
  $("#sum_u_dialog table tbody").append("<tr></tr>");
  // add column headers for component total uncertainty info
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>id</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Name</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Variable</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Label</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Function</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Value</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Total Uncertainty</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>% Total Uncertainty</th>");
  // for each component
  for(i=0; i<cl; i++){
    // add component values
    $("#sum_u_dialog table tbody").append("<tr></tr>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: \
      break-word; "+style+"'>"+(i+1)+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: \
      break-word; "+style+"'>"+components[i].data("name")+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: \
      break-word; "+style+"'>"+components[i].data("variable")+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: \
      break-word; "+style+"'>"+components[i].data("label")+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: \
      break-word; "+style+"'>"+components[i].data("fun")+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: \
      break-word; "+style+"'>"+engFormat(components[i].data("nominal"))+
      "</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: \
      break-word; "+style+"'>"+engFormat(U[i])+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: \
      break-word; "+style+"'>"+engFormat((U[i]/Math.abs(
      components[i].data("nominal")))*100)+"</td>");
  }
  // resize dialog to fit content
  resize($("#sum_u_dialog"));
}

// build_sum_umf_dialog builds content for the uncertainty magnification
// factor summary dialog
function build_sum_umf_dialog(){
  var i1, i2, il=inputs.length, cl=components.length, style;
  // define common css styles
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  // add table, tbody, and first row tags
  $("#sum_umf_dialog").append("<table></table>");
  $("#sum_umf_dialog table").append("<tbody></tbody>");
  $("#sum_umf_dialog table tbody").append("<tr></tr>");
  // add column headers for uncertainty magnification factor info
  $("#sum_umf_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>id</th>");
  $("#sum_umf_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Name</th>");
  $("#sum_umf_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Variable</th>");
  // for each input, add input variable
  for(i1=0; i1<il; i1++){
    $("#sum_umf_dialog table tbody tr").append("<th style='padding: 5px; \
      text-decoration: underline; "+style+"'>"+inputs[i1].data("variable")+
      "</th>");
  }
  // for each component, add component values
  for(i1=0; i1<cl; i1++){
    $("#sum_umf_dialog table tbody").append("<tr></tr>");
    $("#sum_umf_dialog table tbody tr:last-child").append("<td style=\
      'word-wrap: break-word; "+style+"'>"+(i1+1)+"</td>");
    $("#sum_umf_dialog table tbody tr:last-child").append("<td style=\
      'word-wrap: break-word; "+style+"'>"+components[i1].data("name")+"</td>");
    $("#sum_umf_dialog table tbody tr:last-child").append("<td style=\
      'word-wrap: break-word; "+style+"'>"+components[i1].data("variable")+
      "</td>");
    for(i2=0; i2<il; i2++){
      $("#sum_umf_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(Math.abs(UMF[i1][i2]))+
        "</td>");
    }
  }
  // resize dialog to fit content
  resize($("#sum_umf_dialog"));
}

// build_sum_upc_dialog builds content for the uncertainty percent
// contribution summary dialog
function build_sum_upc_dialog(){
  var i1, i2, il=inputs.length, cl=components.length, style;
  // define common css styles
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  // add table, tbody, and first row tags
  $("#sum_upc_dialog").append("<table></table>");
  $("#sum_upc_dialog table").append("<tbody></tbody>");
  $("#sum_upc_dialog table tbody").append("<tr></tr>");
  // add column headers for uncertainty percent contribution info
  $("#sum_upc_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>id</th>");
  $("#sum_upc_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Name</th>");
  $("#sum_upc_dialog table tbody tr").append("<th style='padding: 5px; \
    text-decoration: underline; "+style+"'>Variable</th>");
  // for each input, add input variable
  for(i1=0; i1<il; i1++){
    $("#sum_upc_dialog table tbody tr").append("<th style='padding: 5px; \
      text-decoration: underline; "+style+"'>"+inputs[i1].data("variable")+
      "</th>");
  }
  // for each component, add component values
  for(i1=0; i1<cl; i1++){
    $("#sum_upc_dialog table tbody").append("<tr></tr>");
    $("#sum_upc_dialog table tbody tr:last-child").append("<td style=\
      'word-wrap: break-word; "+style+"'>"+(i1+1)+"</td>");
    $("#sum_upc_dialog table tbody tr:last-child").append("<td style=\
      'word-wrap: break-word; "+style+"'>"+components[i1].data("name")+"</td>");
    $("#sum_upc_dialog table tbody tr:last-child").append("<td style=\
      'word-wrap: break-word; "+style+"'>"+components[i1].data("variable")+
      "</td>");
    for(i2=0; i2<il; i2++){
      $("#sum_upc_dialog table tbody tr:last-child").append("<td style=\
        'word-wrap: break-word; "+style+"'>"+engFormat(100*UPC[i1][i2])+
        "</td>");
    }
  }
  // resize dialog to fit content
  resize($("#sum_upc_dialog"));
}

//**************************** Calculate dialogs *****************************//

// build_calc_u_dialog builds content for the calculate component total
// uncertainty dialog
function build_calc_u_dialog(){
  // if there are inputs and components
  if(inputs.length>0 && components.length>0){
    // calculate component total uncertainty value
    if(!flags.U){calc_U()};
    // state calculating component total uncertainty value
    $("#calc_u_dialog").append("<p>Calculating the components' total \
      uncertainty is complete.");
    // change dialog to show calculate complete
    calc_u_dialog.dialog({
      title: "Calculation complete",
      buttons: {
        "View Results": calc_u_button_view_results,
        Ok: calc_u_button_ok
      }
    });
    // open calc_u_dialog
    calc_u_dialog.dialog("open");
  // if thare are not inputs or components
  } else {
    // if there are inputs, then there must be no components
    if(inputs.length>0){
      // state no components, add add component button
      $("#calc_u_dialog").append("<p>There are no components added to the \
        system.</p>")
      calc_u_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Components": calc_u_button_add_components,
          Ok: calc_u_button_ok
        }
      });
    // if there are no inputs
    } else {
      // state no inputs, add add input button
      $("#calc_u_dialog").append("<p>There are no inputs added to the \
        system.</p>")
      calc_u_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Inputs": calc_u_button_add_inputs,
          Ok: calc_u_button_ok
        }
      });
    }
    // open calc_u_dialog
    calc_u_dialog.dialog("open");
  }
  // resize dialog to fit content
  resize($("#calc_u_dialog"));
}

// build_calc_umf_dialog builds content for the calculate uncertainty
// magnification factor dialog
function build_calc_umf_dialog(){
  // if there are inputs and components
  if(inputs.length>0 && components.length>0){
    // calculate uncertainty magnification factor value
    if(!flags.UMF){calc_UMF()};
    // state calculating uncertainty magnification factor value
    $("#calc_umf_dialog").append("<p>Calculating the uncertainty magnification \
      factor is complete.");
    // change dialog to show calculate complete
    calc_umf_dialog.dialog({
      title: "Calculation complete",
      buttons: {
        "View Results": calc_umf_button_view_results,
        Ok: calc_umf_button_ok
      }
    });
    // open calc_umf_dialog
    calc_umf_dialog.dialog("open");
  // if thare are not inputs or components
  } else {
    // if there are inputs, then there must be no components
    if(inputs.length>0){
      // state no components, add add component button
      $("#calc_umf_dialog").append("<p>There are no components added to the \
        system.</p>")
      calc_umf_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Components": calc_umf_button_add_components,
          Ok: calc_umf_button_ok
        }
      });
    // if there are no inputs
    } else {
      // state no inputs, add add input button
      $("#calc_umf_dialog").append("<p>There are no inputs added to the \
        system.</p>")
      calc_umf_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Inputs": calc_umf_button_add_inputs,
          Ok: calc_umf_button_ok
        }
      });
    }
    // open calc_umf_dialog
    calc_umf_dialog.dialog("open");
  }
  // resize dialog to fit content
  resize($("#calc_umf_dialog"));
}

// build_calc_upc_dialog builds content for the calculate uncertainty
// percent contribution dialog
function build_calc_upc_dialog(){
  // if there are inputs and components
  if(inputs.length>0 && components.length>0){
    // calculate uncertainty percent contribution value
    if(!flags.UPC){calc_UPC()};
    // state calculating uncertainty percent contribution value
    $("#calc_upc_dialog").append("<p>Calculating the uncertainty percent \
      contribution is complete.");
    // change dialog to show calculate complete
    calc_upc_dialog.dialog({
      title: "Calculation complete",
      buttons: {
        "View Results": calc_upc_button_view_results,
        Ok: calc_upc_button_ok
      }
    });
    // open calc_upc_dialog
    calc_upc_dialog.dialog("open");
  // if thare are not inputs or components
  } else {
    // if there are inputs, then there must be no components
    if(inputs.length>0){
      // state no components, add add component button
      $("#calc_upc_dialog").append("<p>There are no components added to the \
        system.</p>")
      calc_upc_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Components": calc_upc_button_add_components,
          Ok: calc_upc_button_ok
        }
      });
    // if there are no inputs
    } else {
      // state no inputs, add add input button
      $("#calc_upc_dialog").append("<p>There are no inputs added to the \
        system.</p>")
      calc_upc_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Inputs": calc_upc_button_add_inputs,
          Ok: calc_upc_button_ok
        }
      });
    }
    // open calc_upc_dialog
    calc_upc_dialog.dialog("open");
  }
  // resize dialog to fit content
  resize($("#calc_upc_dialog"));
}

//******************************* File dialogs *******************************//

// build_new_dialog builds the content for the new dialog
function build_new_dialog(){
  $("#new_dialog").append("<p>All unsaved work will be lose. Do you want to \
    continue?</p>");
  // resize dialog to fit content
  resize($("#new_dialog"));
}

// build_save_dialog builds the content for the save dialog
function build_save_dialog(){
  // build filename field
  $("#save_dialog").append("<p>Filename:</p>");
  $("#save_dialog").append("<form></form>");
  $("#save_dialog form").append("<input id='save_filename'>");
  $("#save_dialog form input").attr("type", "text");
  $("#save_dialog form input").attr("class", "text ui-widget-content \
    ui-corner-all");
  // resize dialog to fit content
  resize($("#save_dialog"));
}

// build_exit_dialog builds the content for the exit dialog
function build_exit_dialog(){
  $("#exit_dialog").append("<p>All unsaved work will be lose. Do you want to \
    continue?</p>");
  // resize dialog to fit content
  resize($("#exit_dialog"));
}

//******************************* Misc Builds ********************************//

// build_canvas builds a new Raphaeljs canvas when opening a file
function build_canvas(sys){
  // define dataset, source, input, and component variables if not set
  var ds=('ds' in sys)?sys.ds:[];
  var src=('src' in sys)?sys.src:[];
  var inp=('inp' in sys)?sys.inp:[];
  var comp=('comp' in sys)?sys.comp:[];
  // define J, W, Nu, U, UMF, and UPC variables if not set
  J=('J' in sys)?sys.J:[];
  W=('W' in sys)?sys.W:[];
  Nu=('Nu' in sys)?sys.Nu:[];
  U=('U' in sys)?sys.U:[];
  UMF=('UMF' in sys)?sys.UMF:[];
  UPC=('UPC' in sys)?sys.UPC:[];
  // define flags if not set
  flags=('flags' in sys)?sys.flags:{info:false, before:false, after:false,
    cor:false, J:false, W:false, Nu:false, U:false, UMF:false, UPC:false};
  var il=inp.length, cl=comp.length, dsl=ds.length, srcl=src.length;
  var i1, i2;
  // for each input
  for(i1=0; i1<il; i1++){
    // get input x, y, width, and height
    var ox=inp[i1].ox;
    var oy=inp[i1].oy;
    var ow=inp[i1].ow;
    var oh=inp[i1].oh;
    // get input name, variable, label, nominal value, nominal dataset,
    // random uncertainty value, random uncertainty dataset, and systematic
    // uncertainty sources
    var name=inp[i1].name;
    var variable=inp[i1].variable;
    var label=inp[i1].label;
    var nominal=inp[i1].nominal;
    var nom_ds=inp[i1].nom_ds;
    var random=inp[i1].random;
    var rand_ds=inp[i1].rand_ds;
    var sys_src=inp[i1].sys_src;
    // add input object to Raphaeljs
    r.addobj({type:"ellipse", x:ox, y:oy, w:ow, h:oh, name:name,
      variable:variable, label:label, nominal:nominal, nom_ds:nom_ds,
      random:random, rand_ds:rand_ds, sys_src:sys_src});
  }
  // for each component
  for(i1=0; i1<cl; i1++){
    // get component x, y, width, and height
    var ox=comp[i1].ox;
    var oy=comp[i1].oy;
    var ow=comp[i1].ow;
    var oh=comp[i1].oh;
    // get component name, variable, label, and function
    var name=comp[i1].name;
    var variable=comp[i1].variable;
    var label=comp[i1].label;
    var fun=comp[i1].fun;
    // add component object to Raphaeljs
    r.addobj({type:"rect", x:ox, y:oy, w:ow, h:oh, name:name,
      variable:variable, label:label, fun:fun});
    // get dependent variables of component function
    var dep_var=get_dep(fun);
    // get all input and component variables
    var inp_var=get_inp_var();
    var comp_var=get_comp_var();
    // get number of depenedent variables
    var dvl=dep_var.length;
    // get number of input and component variables
    var ivl=inp_var.length;
    var cvl=comp_var.length;
    // for each input variables
    for(i2=0; i2<ivl; i2++){
      // if input variable is a dependent variable, add connection
      if($.inArray(inp_var[i2],dep_var)!=-1){
        r.addcon(inputs[i2],components[i1]);
      }
    }
    // for each component variable
    for(i2=0; i2<cvl; i2++){
      // if component variable is a dependent variable, add connections
      if($.inArray(comp_var[i2],dep_var)!=-1){
        r.addcon(components[i2],components[i1]);
      }
    }
  }
  // for each dataset
  for(i1=0; i1<dsl; i1++){
    // get name and values
    var name=ds[i1].name;
    var values=ds[i1].values;
    // push to datasets array
    datasets.push({name: name, values: values});
  }
  // for each source
  for(i1=0; i1<srcl; i1++){
    // get name and value
    var name=src[i1].name;
    var value=src[i1].value;
    // push to sources array
    sources.push({name: name, value: value});
  }
  // calcualte component nominal value
  calc_comp_nom();
  // set viewbox and zoom value
  viewbox=sys.viewbox;
  zoom=sys.zoom;
  r.setViewBox.apply(r, viewbox);
}

// build_toolbar builds the toolbar
function build_toolbar(){
  // if element info flag is set, check
  if(flags.info){
    $("#toolbar").append("<input type='checkbox' id='tb_tip' checked><label \
      class='small_button' for='tb_tip'>Toggle Element Info</label>");
  // if element info flag is not set, uncheck
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_tip'><label class='\
      small_button' for='tb_tip'>Toggle Element Info</label>");
  }
  // if backwards dependencies is set, check
  if(flags.before){
    $("#toolbar").append("<input type='checkbox' id='tb_before' checked><label\
      class='small_button' for='tb_before'>Toggle Dependencies View (Green)\
      </label>");
  // if backwards dependencies is not set, uncheck
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_before'><label class='\
      small_button' for='tb_before'>Toggle Dependencies View (Green)</label>");
  }
  // if forward dependencies is set, check
  if(flags.after){
    $("#toolbar").append("<input type='checkbox' id='tb_after' checked><label \
      class='small_button' for='tb_after'>Toggle Dependencies View (Red)\
      </label>");
  // if forward dependencies is not set, uncheck
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_after'><label class='\
      small_button' for='tb_after'>Toggle Dependencies View (Red)</label>");
  }
  // if correlation view is set, check
  if(flags.cor){
    $("#toolbar").append("<input type='checkbox' id='tb_cor' checked><label \
      class='small_button' for='tb_cor'>Toggle Correlation View (Blue)\
      </label>");
  // if correlation view is not set, uncheck
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_cor'><label class='\
      small_button' for='tb_cor'>Toggle Correlation View (Blue)</label>");
  }
  // add dataset, source, input, and component button to toolbar
  $("#toolbar").append("<button id='tb_ds' class='small_button'>Dataset\
    </button>");
  $("#toolbar").append("<button id='tb_src' class='small_button'>System \
    Uncertainty Source</button>");
  $("#toolbar").append("<button id='tb_inp' class='small_button'>Input\
    </button>");
  $("#toolbar").append("<button id='tb_comp' class='small_button'>Component\
    </button>");
  // set button icons and hover text
  $("#tb_tip").button({
    icons: {primary: "ui-icon-comment"},
    text: false,
    label: 'Toogle Element Info'
  });
  $("#tb_before").button({
    icons: {primary: "ui-icon-arrowstop-1-w"},
    text: false,
    label: 'Toggle Dependency View (Green)'
  });
  $("#tb_after").button({
    icons: {primary: "ui-icon-arrowstop-1-e"},
    text: false,
    label: 'Toggle Dependency View (Red)'
  });
  $("#tb_cor").button({
    icons: {primary: "ui-icon-arrow-2-e-w"},
    text: false,
    label: 'Toggle Correlation View (Blue)'
  });
  $("#tb_ds").button({
    icons: {primary: "ds"},
    text: false,
    label: 'Dataset'
  });
  $("#tb_src").button({
    icons: {primary: "src"},
    text: false,
    label: 'Systematic Uncertainty Source'
  });
  $("#tb_inp").button({
    icons: {primary: "inp"},
    text: false,
    label: 'Input'
  });
  $("#tb_comp").button({
    icons: {primary: "comp"},
    text: false,
    label: 'Component'
  });
  // click events to toggle buttons
  $("#tb_tip").click(function(){
    if(flags.info){
      $("#tip").css("display", "none");
      $("#toggle_tip").html("View Element Info");
      flags.info=false;
    } else {
      $("#toggle_tip").html("Hide Element Info");
      flags.info=true;
    }
  });
  $("#tb_before").click(function(){
    if(flags.before){
      $("#toggle_before").html("View Dependency View (Green)");
      flags.before=false;
    } else {
      $("#toggle_before").html("Hide Dependency View (Green)");
      flags.before=true;
    }
  });
  $("#tb_after").click(function(){
    if(flags.after){
      $("#toggle_after").html("View Dependency View (Red)");
      flags.after=false;
    } else {
      $("#toggle_after").html("Hide Dependency View (Red)");
      flags.after=true;
    }
  });
  $("#tb_cor").click(function(){
    if(flags.cor){
      $("#toggle_correlation").html("View Correlation View (Blue)");
      flags.cor=false;
    } else {
      $("#toggle_correlation").html("Hide Correlation View (Blue)");
      flags.cor=true;
    }
  });
  // add click event for dataset, source, input, and component buttons
  $("#tb_ds").click(function(e){
    $("#Datasets").click();
    e.preventDefault();
  });
  $("#tb_src").click(function(e){
    $("#Sources").click();
    e.preventDefault();
  });
  $("#tb_inp").click(function(e){
    $("#Inputs").click();
    e.preventDefault();
  });
  $("#tb_comp").click(function(e){
    $("#Components").click();
    e.preventDefault();
  });
}

// build_error_dialog builds the error dialog
function build_error_dialog(){
  $("#error_dialog").append("<p>Aw shucks! Looks like something went wrong. \
  Would you like to send an error report to help make the app better?</p>");
  resize($("#error_dialog"));
}

//****************************************************************************//
//                                                                            //
//                              Empty Functions                               //
//                                                                            //
//****************************************************************************//
// These functions empty the various content.                                 //
//****************************************************************************//

// empty_dialog empties the 'this' dialog
function empty_dialog(){
  // set any working indexes to zero
  if($(this).attr("id")=="edit_ds_dialog"){ds_edit=-1;}
  if($(this).attr("id")=="del_ds_dialog"){ds_del=-1;}
  if($(this).attr("id")=="edit_src_dialog"){src_edit=-1;}
  if($(this).attr("id")=="del_src_dialog"){src_del=-1;}
  if($(this).attr("id")=="add_inp_dialog"){
    ds_nom=-1;
    ds_rand=-1;
    src_sys=[];
  }
  if($(this).attr("id")=="edit_inp_dialog"){
    inp_edit=-1;
    ds_nom=-1;
    ds_rand=-1;
    src_sys=[];
  }
  if($(this).attr("id")=="del_inp_dialog"){inp_del=-1;}
  //if($(this).attr("id")=="apply_ds_2_nom_dialog"){ds_nom=-1;}
  //if($(this).attr("id")=="apply_ds_2_rand_dialog"){ds_rand=-1;}
  //if($(this).attr("id")=="apply_src_2_sys_dialog"){src_sys=[];}
  if($(this).attr("id")=="edit_comp_dialog"){comp_edit=-1;}
  if($(this).attr("id")=="del_comp_dialog"){comp_del=-1;}
  $(this).empty();
}

// empty_canvas empties the Raphaeljs canvas to a blank paper
function empty_canvas(){
  var i, il=inputs.length, cl=components.length, conl=connections.length,
    dsl=datasets.length, srcl=sources.length;
  // for each input, remove input and label
  for(i=0; i<il; i++){
    inputs[i].remove();
    input_labels[i].remove();
  }
  // set input and label variables to empty arrays
  inputs=[];
  input_labels=[];
  // for each component, remove component and label
  for(i=0; i<cl; i++){
    components[i].remove();
    component_labels[i].remove();
  }
  // component and label variables to empty arrays
  components=[];
  component_labels=[];
  // for each connection, remove connection line and arrow head
  for(i=0; i<conl; i++){
    connections[i].to.remove();
    connections[i].from.remove();
    connections[i].line.remove();
    connections[i].arr.remove();
  }
  // set connection, dataset, and source variable to empty array
  connections=[];
  datasets=[];
  sources=[];
}

// empty_toolbar empties the toolbar
function empty_toolbar(){
  // empty the toolbar
  $("#toolbar").empty();
}

//****************************************************************************//
//                                                                            //
//                              Button Functions                              //
//                                                                            //
//****************************************************************************//
// These functions are the dialog button functions.                           //
//****************************************************************************//

//****************************** Action dialogs ******************************//

// ds_button_ok performs the ok button action of the dataset dialog
function ds_button_ok(){
  // close the dialog
  ds_dialog.dialog("close");
}

// src_button_ok performs the ok button action of the source dialog
function src_button_ok(){
  // close the dialog
  src_dialog.dialog("close");
}

// inp_button_ok performs the ok button action of the input dialog
function inp_button_ok(){
  // close the dialog
  inp_dialog.dialog("close");
}

// comp_button_ok performs the ok button action of the component dialog
function comp_button_ok(){
  // close the dialog
  comp_dialog.dialog("close");
}

//******************************* Add dialogs ********************************//
// *** Add Dataset *** //

// add_ds_button_add_dataset performs the add dataset action of the add
// dataset dialog
function add_ds_button_add_dataset(){
  var warn=[], warn_str, ws, i;
  // get the name of the dataset
  var name=$("#add_ds_name").val().trim();
  // check if name is not blank
  if(name.length<=0){warn.push("name");}
  // check if dataset is valid dataset
  if(!ds_valid){warn.push("data");}
  // if no errors
  if(warn.length==0){
    // add dataset to datasets array
    datasets.push({name: name, values: ds_str_2_arr(data_str)});
    // clear data_str string, and set dataset valid to false
    data_str="";
    ds_valid=false;
    // close the dialog and reopen dataset dialog
    add_ds_dialog.dialog("close");
    ds_dialog.dialog("close");
    $("#Datasets").click();
  // if there were errors
  } else {
    // build error string
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if(ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){warn_str=warn_str+", "+warn[i];}
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the dataset is not valid.";
    // build warning dialog
    $("body").append("<div id='warn' class='dialog' title='Fields Required'>\
      <p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

// add_ds_button_cancel performs the cancel button action of the add dataset
// dialog
function add_ds_button_cancel(){
  // close the dialog
  add_ds_dialog.dialog("close");
}

// *** Add Source *** //

// add_src_button_add_source performs the add source action of the add
// source dialog
function add_src_button_add_source(){
  var warn=[], warn_str, ws, i;
  var num_regex=/^[0-9][.0-9]*$/;
  // get the name, and value of the source
  var name=$("#add_src_name").val().trim();
  var value=$("#add_src_value").val().trim();
  // check if name, and value are valid
  if(name.length<=0){warn.push("name");}
  if((value.length<=0) || !(num_regex.test(value))){warn.push("value");}
  // if no errors
  if(warn.length==0){
    // add source to sources array
    sources.push({name: name, value: Number(value)});
    // close the dialog and reopen source dialog
    src_dialog.dialog("close");
    $("#Sources").click();
    add_src_dialog.dialog("close");
  // if there were errors
  } else {
    // build error string
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if(ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else {
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){warn_str=warn_str+", "+warn[i];}
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the source is not valid.";
    // build warning dialog
    $("body").append("<div id='warn' class='dialog' title='Fields Required'>\
      <p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

// add_src_button_cancel performs the cancel button action of the add source
// dialog
function add_src_button_cancel(){
  // close the dialog
  add_src_dialog.dialog("close");
}

// *** Add Input *** //

// add_inp_button_add_input performs the add input action of the add input
// dialog
function add_inp_button_add_input(){
  var warn=[], warn_str, ws, i;
  var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
  var nom_regex=/^[0-9][.0-9]*$/;
  // get the name, variable, label, nominal value, and random value of the input
  var name=$("#add_inp_name").val().trim();
  var variable=$("#add_inp_variable").val().trim();
  var label=$("#add_inp_label").val().trim();
  var nominal=$("#add_inp_nominal").val().trim();
  var random=$("#add_inp_random").val().trim();
  // check if name, variable, label, nominal value, and random value are valid
  if(name.length<=0){warn.push("name");}
  if((variable.length<=0) || !variable_regex.test(variable)){
    warn.push("variable");
  }
  if(label.length<=0){warn.push("label");}
  if((nominal.length<=0) || !(nom_regex.test(nominal))){
    warn.push("nominal value");
  }
  if((random.length<=0) || !(nom_regex.test(random))){
    warn.push("random uncertainty");
  }
  // if no errors
  if(warn.length==0){
    // if variable is valid
    if(valid_variable(inputs, components, variable)){
      // build input width and height
      var hw=$("#holder").width(), hh=$("#holder").height(), ow=50, oh=50;
      var os=get_text_size(label);
      if(os[0]>ow){ow=Math.round(os[0])+10;}
      if(os[1]>oh){oh=Math.round(os[1])+10;}
      if(ow>oh){
        oh=ow;
      } else {
        ow=oh;
      }
      // add input to canvas
      r.addobj({type:"ellipse", x:hw/2-ow/2, y:hh/2-oh/2, w:ow, h:oh, name:name,
        variable:variable, label:label, nominal:nominal, nom_ds:ds_nom,
        random:random, rand_ds:ds_rand, sys_src:src_sys});
      // calculate components nominal values
      calc_comp_nom();
      // set dialog fields to null
      $("#add_inp_name").val("");
      $("#add_inp_variable").val("");
      $("#add_inp_label").val("");
      $("#add_inp_nominal").val("");
      $("#add_inp_random").val("");
      $("#add_inp_systematic").val("");
      // set flags to false
      flags.J=false;
      flags.W=false;
      flags.NU=false;
      flags.U=false;
      flags.UMF=false;
      flags.UPC=false;
      // remove summary links
      $("#sum_u").remove();
      $("#sum_umf").remove();
      $("#sum_upc").remove();
      // close dialog and reopen inputs dialog
      add_inp_dialog.dialog("close");
      inp_dialog.dialog("close");
      $("#Inputs").click();
    // if variable is not valid, warn
    } else {
      $("body").append("<div id='warn' class='dialog' title='Warning'><p>Input\
        variable must be unique or not a built in constant.</p></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
    }
  // if there were errors
  } else {
    // build error string
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if(ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){warn_str=warn_str+", "+warn[i];}
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the input is not valid.";
    // build warning dialog
    $("body").append("<div id='warn' class='dialog' title='Fields Required'>\
      <p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

// add_inp_button_cancel performs the cancel button action of the add input
// dialog
function add_inp_button_cancel(){
  // close the dialog
  add_inp_dialog.dialog("close");
}

// *** Add Component *** //

// add_comp_button_add_component performs the add component action of the add
// component dialog
function add_comp_button_add_component(){
  var warn=[], warn_str, ws, i;
  var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
  // get the name, variable, label, and function of the component
  var name=$("#add_comp_name").val().trim();
  var variable=$("#add_comp_variable").val().trim();
  var label=$("#add_comp_label").val().trim();
  var fun=$("#add_comp_fun").val().trim();
  // check if name, variable, label, and function are valid
  if(name.length<=0){warn.push("name");}
  if(variable.length<=0 || !variable_regex.test(variable)){
    warn.push("variable");
  }
  if(label.length<=0){warn.push("label");}
  if(fun.length<=0 || get_dep(fun).length==0){warn.push("function");}
  // if no errors
  if(warn.length==0){
    // if variable is valid
    if(valid_variable(inputs, components, variable)){
      // get dependent, input, and component variables
      var dep_var=get_dep(fun);
      var inp_var=get_inp_var();
      var comp_var=get_comp_var();
      // get number of dependent, input, and component variables
      var dvs=dep_var.length;
      var ivs=inp_var.length;
      var cvs=comp_var.length;
      var var_boolean=0;
      // if there are input variables
      if(inp_var){
        // for each dependent variable, check if it is an input or component
        // variable
        for(i=0; i<dvs; i++){
          if($.inArray(dep_var[i],inp_var)==-1 &&
             $.inArray(dep_var[i],comp_var)==-1){
            var_boolean+=1;
          }
        }
        // if all dependent variables are input or component variables
        if(var_boolean==0){
          // build component width and height
          var cl=components.length
          var hw=$("#holder").width(), hh=$("#holder").height(), ow=50, oh=50;
          var os=get_text_size(label);
          if(os[0]>ow){ow=Math.round(os[0])+10;}
          if(os[1]>oh){oh=Math.round(os[1])+10;}
          if(ow>oh){
            oh=ow;
          } else {
            ow=oh;
          }
          // add component to canvas
          r.addobj({type:"rect", x:hw/2-ow/2, y:hh/2-oh/2, w:ow, h:oh,
                    name:name, variable:variable, label:label, fun:fun});
          // for each input variable
          for(i=0; i<ivs; i++){
            // if input variable is dependent variable, add connection
            if($.inArray(inp_var[i],dep_var)!=-1){
              r.addcon(inputs[i],components[cl]);
            }
          }
          // for each component variable
          for(i=0; i<cvs; i++){
            // if component variable is dependent variable, add connection
            if($.inArray(comp_var[i],dep_var)!=-1){
              r.addcon(components[i],components[cl]);
            }
          }
          // calculate components nominal values
          calc_comp_nom();
          // set dialog fields to null
          $("#add_com_name").val("");
          $("#add_comp_variable").val("");
          $("#add_com_label").val("");
          $("#add_com_fun").val("");
          // set flags to false
          flags.J=false;
          flags.W=false;
          flags.U=false;
          flags.UMF=false;
          flags.UPC=false;
          // remove summary links
          $("#sum_u").remove();
          $("#sum_umf").remove();
          $("#sum_upc").remove();
          // close dialog and reopen compeonts dialog
          add_comp_dialog.dialog("close");
          comp_dialog.dialog("close");
          $("#Components").click();
        // if dependent variable is not a input or component variable, warn
        } else {
          $("body").append("<div id='warn' class='dialog' title='Warning'>\
            <p>The function contains input(s) that have not been added yet. \
            Would you like to add the input now?</p></div>");
          $(function(){
            $("#warn").dialog({
              modal: true,
              buttons: {
                "Add Input": function(){
                  $(this).dialog("close");
                  add_comp_dialog.dialog("close");
                  add_inp_dialog.dialog("open");
                  $("#warn").remove();
                },
                Ok: function(){
                  $(this).dialog("close");
                  $("#warn").remove();
                }
              }
            });
          });
        }
      // if there are no input variables, warn
      } else {
        $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
          No inputs have been added yet.</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              "Add Input": function(){
                $(this).dialog("close");
                add_comp_dialog.dialog("close");
                add_inp_dialog.dialog("open");
                $("#warn").remove();
              },
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          });
        });
      }
    // if variable is not valid
    } else {
      $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
        Component variable must be unique or not a built in constant.</p>\
        </div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
    }
  // if there were errors
  } else {
    // build error string
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str+=warn[0];
    } else {
      warn_str+=warn[0];
      for(i=1; i<ws-1; i++){warn_str+=", "+warn[i];}
      warn_str+=", and "+warn[ws-1];
    }
    warn_str+=" of the component is not valid.";
    // build warning dialog
    $("body").append("<div id='warn' class='dialog' title='Fields Required'>\
      <p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

// add_comp_button_cancel performs the cancel button action of the add component
// dialog
function add_comp_button_cancel(){
  // close the dialog
  add_comp_dialog.dialog("close");
}

//******************************* Edit dialogs *******************************//
// *** Edit Dataset *** //

// edit_ds_button_edit_dataset performs the edit dataset action of the edit
// dataset dialog
function edit_ds_button_edit_dataset(){
  var i, il, dl, mess="", dep=[], warn=[], warn_str, ws;
  // get the name of the datset
  var name=$("#edit_ds_name").val().trim();
  // check if name is not blank
  if(name.length<=0){warn.push("name");}
  // check if dataset is valid dataset
  if(!ds_valid){warn.push("data");}
  // if no errors
  if(warn.length==0){
    il=inputs.length;
    // for each input, check if input is dependent on dataset
    for(i=0; i<il; i++){
      if(ds_edit==inputs[i].data("nom_ds") || ds_edit==
        inputs[i].data("rand_ds")){
        dep.push(i);
      }
    }
    // if inputs are dependent, warn about dependency
    if(dep.length>0){
      dl=dep.length;
      // build warning string
      mess="This will modify value for input";
      if(dl==1){
        mess=mess+" "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+").";
      } else {
        mess=mess+"s ";
        for(i=0; i<dl-1; i++){mess=mess+(dep[i]+1)+", ";}
        mess=mess+"and "+(dep[dl-1]+1)+" (";
        for(i=0; i<dl-1; i++){mess=mess+inputs[dep[i]].data("name")+", ";}
        mess=mess+"and "+inputs[dep[dl-1]].data("name")+").";
      }
      mess=mess+" Are you sure?";
      // build warning dialog
      $("body").append("<div id='warn' class='dialog' title='Are you sure?'>\
        <p>"+mess+"</p></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Yes: function(){
              // if still want to edit dataset, edit dataset
              datasets[ds_edit].name=name;
              datasets[ds_edit].values=ds_str_2_arr(data_str);
              data_str="";
              ds_valid=false;
              var num, mean, stdev, r;
              num=num_samples(datasets[ds_edit].values);
              mean=mu(datasets[ds_edit].values);
              stdev=sig(datasets[ds_edit].values, mean);
              r=t_dist(num)*sig(datasets[ds_edit].values, mean)/
                Math.pow(num,1/2);
              // update input dataset values
              for(i=0; i<di; i++){
                if(ds_edit==inputs[dep[i]].data("nom_ds")){
                  inputs[dep[i]].data("nominal", mean);
                }
                if(ds_edit==inputs[dep[i]].data("rand_ds")){
                  inputs[dep[i]].data("random", r);
                }
              }
              // close the dialog and reopen dataset dialog
              $(this).dialog("close");
              $("#warn").remove();
              edit_ds_dialog.dialog("close");
              ds_dialog.dialog("close");
              $("#Datasets").click();
            },
            Cancel: function(){
              // if do not want to edit dataset, close dialog
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
    // if no inputs are dependent, edit dataset
    } else {
      datasets[ds_edit].name=name;
      datasets[ds_edit].values=ds_str_2_arr(data_str);
      data_str="";
      ds_valid=false;
      // close dialog and reopen dataset dialog
      edit_ds_dialog.dialog("close");
      ds_dialog.dialog("close");
      $("#Datasets").click();
    }
  // if there were errors
  } else {
    // build error string
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if(ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){warn_str=warn_str+", "+warn[i];}
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the dataset is not valid.";
    // build warning dialog
    $("body").append("<div id='warn' class='dialog' title='Fields Required'>\
      <p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

// edit_ds_button_cancel performs the cancel button action of the edit dataset
// dialog
function edit_ds_button_cancel(){
  // close the dialog
  edit_ds_dialog.dialog("close");
}

// *** Edit Source *** //

// edit_src_button_edit_source performs the edit source action of the edit
// source dialog
function edit_src_button_edit_source(){
  var i, il, dl, mess="", dep=[], warn=[], warn_str, ws;
  // get the name, and value of the source
  var name=$("#edit_src_name").val().trim();
  var value=$("#edit_src_value").val().trim();
  // check if name, and value are valid
  if(name.length<=0){warn.push("name");}
  if(value.length<=0){warn.push("value");}
  // if no errors
  if(warn.length==0){
    il=inputs.length;
    // for each input, check if input is dependent on source
    for(i=0; i<il; i++){
      if(inputs[i].data("sys_src").indexOf(src_edit)>=0){dep.push(i);}
    }
    // inputs are dependent, warn about dependency
    if(dep.length>0){
      dl=dep.length;
      // build warning string
      mess="This will modify value for input";
      if(dl==1){
        mess=mess+" "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+").";
      } else {
        mess=mess+"s ";
        for(i=0; i<dl-1; i++){mess=mess+(dep[i]+1)+", ";}
        mess=mess+"and "+(dep[dl-1]+1)+" (";
        for(i=0; i<dl-1; i++){mess=mess+inputs[dep[i]].data("name")+", ";}
        mess=mess+"and "+inputs[dep[dl-1]].data("name")+").";
      }
      mess=mess+" Are you sure?";
      // build warning dialog
      $("body").append("<div id='warn' class='dialog' title='Are you sure?'>\
        <p>"+mess+"</p></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Yes: function(){
              // if still want to edit source, edit source
              sources[src_edit].name=name;
              sources[src_edit].value=value;
              // close the dialog and reopen source dialog
              $(this).dialog("close");
              $("#warn").remove();
              edit_src_dialog.dialog("close");
              src_dialog.dialog("close");
              $("#Sources").click();
            },
            Cancel: function(){
              // if do not want to edit source, close dialog
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
    // if no inputs are dependent, edit source
    } else {
      sources[src_edit].name=name;
      sources[src_edit].value=value;
      // close dialog and reopen source dialog
      edit_src_dialog.dialog("close");
      src_dialog.dialog("close");
      $("#Sources").click();
    }
  // if there were errors
  } else {
    // build error string
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if(ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else {
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){warn_str=warn_str+", "+warn[i];}
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the source is not valid.";
    // build warning dialog
    $("body").append("<div id='warn' class='dialog' title='Fields Required'>\
      <p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

// edit_src_button_cancel performs the cancel button action of the edit source
// dialog
function edit_src_button_cancel(){
  // close the dialog
  edit_src_dialog.dialog("close");
}

// *** Edit Input *** //

// edit_inp_button_edit_input performs the edit input action of the edit
// input dialog
function edit_inp_button_edit_input(){
  var warn=[], warn_str, ws, i, iof, cl=components.length;
  var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
  var nom_regex=/^[0-9][.0-9]*$/;
  // get the name, variable, label, nominal value, and random value of input
  var name=$("#edit_inp_name").val().trim();
  var variable=$("#edit_inp_variable").val().trim();
  var label=$("#edit_inp_label").val().trim();
  var nominal=$("#edit_inp_nominal").val().trim();
  var random=$("#edit_inp_random").val().trim();
  // check if name, variable, label, nominal value, and random value are valid
  if(name.length<=0){warn.push("name");}
  if((variable.length<=0) || !variable_regex.test(variable)){
    warn.push("variable");
  }
  if(label.length<=0){warn.push("label");}
  if((nominal.length<=0) || !(nom_regex.test(nominal))){
    warn.push("nominal value");
  }
  if((random.length<=0) || !(nom_regex.test(random))){
    warn.push("random uncertainty");
  }
  // if no errors
  if(warn.length==0){
    // if variable is valid
    if(valid_variable(inputs, components, variable) || variable==
      inputs[inp_edit].data("variable")){
      // build input width, and height
      var ow=50, oh=50, os=get_text_size(label);
      if(os[0]>ow){ow=Math.round(os[0])+10;}
      if(os[1]>oh){oh=Math.round(os[1])+10;}
      if(ow>oh){
        oh=ow;
      } else {
        ow=oh;
      }
      // edit input width, and height
      inputs[inp_edit].attr({rx:ow/2, ry:oh/2});
      inputs[inp_edit].data("name", name);
      // if variable has been changed
      if(inputs[inp_edit].data("variable")!=variable){
        // for every component, update variable change
        for(i=0; i<cl; i++){
          components[i].data("fun",replace_var_expr(
            inputs[inp_edit].data("variable"), variable,
            components[i].data("fun")));
        }
      }
      // edit input variable, label, nominal value, nominal dataset, random
      // value, random dataset, and systematic sources
      inputs[inp_edit].data("variable", variable);
      inputs[inp_edit].data("label", label);
      inputs[inp_edit].data("nominal", nominal);
      inputs[inp_edit].data("nom_ds", Number(ds_nom));
      inputs[inp_edit].data("random", random);
      inputs[inp_edit].data("rand_ds", Number(ds_rand));
      inputs[inp_edit].data("sys_src", src_sys);
      // edit input label values
      input_labels[inp_edit].attr({width:ow, height:oh});
      input_labels[inp_edit].data("variable", variable);
      input_labels[inp_edit].node.getElementsByTagName("tspan")[0].innerHTML=
        svg_label(label);
      // calculate components nominal values
      calc_comp_nom();
      // set flags to false
      flags.J=false;
      flags.W=false;
      flags.Nu=false;
      flags.U=false;
      flags.UMF=false;
      flags.UPC=false;
      // remove summaries
      $("#sum_u").remove();
      $("#sum_umf").remove();
      $("#sum_upc").remove();
      // close dialog and reopen input dialog
      edit_inp_dialog.dialog("close");
      inp_dialog.dialog("close");
      $("#Inputs").click();
    // if variable is not valid, warn
    } else {
      $("body").append("<div id='warn' class='dialog' title='Warning'><p>Input \
        variable must be unique or not a built in constant.</p></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
    }
  // if there were errors
  } else {
    // build error string
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if(ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else {
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){warn_str=warn_str+", "+warn[i];}
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the input is not valid.";
    // build warning dialog
    $("body").append("<div id='warn' class='dialog' title='Fields Required'>\
      <p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

// edit_inp_button_cancel performs the cancel button action of the edit input
// dialog
function edit_inp_button_cancel(){
  // close the dialog
  edit_inp_dialog.dialog("close");
}

// *** Edit Component *** //

// edit_comp_button_edit_component performs the edit input action of the edit
// component dialog
function edit_comp_button_edit_component(){
  var warn=[], warn_str, ws, i, cl=components.length;
  var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
  // get the name, variable, label, and function of component
  var name=$("#edit_comp_name").val().trim();
  var variable=$("#edit_comp_variable").val().trim();
  var label=$("#edit_comp_label").val().trim();
  var fun=$("#edit_comp_fun").val().trim();
  // check if name, variable, label, and function are valid
  if(name.length<=0){warn.push("name");}
  if((variable.length<=0) || !variable_regex.test(variable)){
    warn.push("variable");
  }
  if(label.length<=0){warn.push("label");}
  if(fun.length<=0 || get_dep(fun).length==0){warn.push("function");}
  // if no errors
  if(warn.length==0){
    // if variable is valid
    if(valid_variable(inputs, components, variable) || variable==
      components[comp_edit].data("variable")){
      // build component width, and height
      var ow=50, oh=50, os=get_text_size(label);
      if(os[0]>ow){ow=Math.round(os[0])+10;}
      if(os[1]>oh){oh=Math.round(os[1])+10;}
      if(ow>oh){
        oh=ow;
      } else {
        ow=oh;
      }
      var ox=components[comp_edit].attr("x")+
        components[comp_edit].attr("width")/2-ow/2;
      var oy=components[comp_edit].attr("y")+
        components[comp_edit].attr("height")/2-oh/2;
      // edit component width, height, and name
      components[comp_edit].attr({x:ox, y:oy, width:ow, height:oh});
      components[comp_edit].data("name", name);
      // if variable has been changes
      if(components[comp_edit].data("variable")!=variable){
        // for every component, update variable change
        for(i=0; i<cl; i++){
          components[i].data("fun",replace_var_expr(
            components[comp_edit].data("variable"), variable,
            components[i].data("fun")));
        }
      }
      // edit component variable, label, and function
      components[comp_edit].data("variable", variable);
      components[comp_edit].data("label", label);
      components[comp_edit].data("fun", fun);
      // edit component label values
      component_labels[comp_edit].attr({x:components[comp_edit].attr("x")+ow/2,
        y:components[comp_edit].attr("y")+oh/2});
      component_labels[comp_edit].data("variable", variable);
      component_labels[comp_edit].node.getElementsByTagName("tspan")[0]
        .innerHTML=svg_label(label);
      component_labels[comp_edit].node.getElementsByTagName("tspan")[0]
        .setAttribute("dy", "3.5");
      // get dependent, input, and component variables
      var dep_var=get_dep(fun);
      var inp_var=get_inp_var();
      var comp_var=get_comp_var();
      // get number of dependent, input, and component variables and connections
      var dvl=dep_var.length;
      var ivl=inp_var.length;
      var cvl=comp_var.length;
      var conl=connections.length;
      var nc=[];
      // for every connection, update variable change
      for(i=0; i<conl; i++){
        if(connections[i].to.data("variable")==variable){
          connections[i].line.remove();
          connections[i].arr.remove();
        } else {
          nc.push(connections[i]);
        }
      }
      connections=nc;
      // for each input, add connection back
      for(i=0; i<ivl; i++){
        if($.inArray(inp_var[i],dep_var)!=-1){
          r.addcon(inputs[i],components[comp_edit]);
        }
      }
      // for each component, add connection back
      for(i=0; i<cvl; i++){
        if($.inArray(comp_var[i],dep_var)!=-1){
          r.addcon(components[i],components[comp_edit]);
        }
      }
      // calculate component nominal values
      calc_comp_nom();
      // set flags to false
      flags.J=false;
      flags.W=false;
      flags.U=false;
      flags.UMF=false;
      flags.UPC=false;
      // remove summaries
      $("#u_sum").remove();
      $("#umf_sum").remove();
      $("#upc_sum").remove();
      // close dialog and reopen components dialog
      edit_comp_dialog.dialog("close");
      comp_dialog.dialog("close");
      $("#Components").click();
    // if variable is not valid, warn
    } else {
      $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
        Component variable must be unique or not a built in constant.</p>\
        </div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        });
      });
    }
  // if there were errors
  } else {
    // build error string
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if(ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else {
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){warn_str=warn_str+", "+warn[i];}
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the component is not valid.";
    // build warning dialog
    $("body").append("<div id='warn' class='dialog' title='Fields Required'>\
      <p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

// edit_comp_button_cancel performs the cancel button action of the edit
// component dialog
function edit_comp_button_cancel(){
  // close the dialog
  edit_comp_dialog.dialog("close");
}

//****************************** Delete dialogs ******************************//

// *** Delete Dataset *** //

// del_ds_button_ok performs the ok button action of the delete dataset dialog
function del_ds_button_ok(){
  var i, il=inputs.length;
  // remove the particular dataset out of datasets array
  datasets.splice(ds_del, 1);
  // for each input, check if uses dataset
  for(i=0; i<il; i++){
    // if uses for nominal or random value, remove
    if(inputs[i].data("nom_ds")==ds_del){inputs[i].data("nom_ds", -1);}
    if(inputs[i].data("rand_ds")==ds_del){inputs[i].data("rand_ds", -1);}
    // if uses a higher index dataset, bump down index by one
    if(inputs[i].data("nom_ds")>ds_del){
      inputs[i].data("nom_ds", inputs[i].data("nom_ds")-1);
    }
    if(inputs[i].data("rand_ds")>ds_del){
      inputs[i].data("rand_ds", inputs[i].data("rand_ds")-1);
    }
  }
  // set working dataset index to -1
  ds_del=-1;
  // close and reopen datasets dialog
  del_ds_dialog.dialog("close");
  ds_dialog.dialog("close");
  $("#Datasets").click();
}

// del_ds_button_cancel performs the cancel button action of the delete dataset
// dialog
function del_ds_button_cancel(){
  // close the dialog
  del_ds_dialog.dialog("close");
}

// *** Delete Source *** //

// del_src_button_ok performs the ok button action of the delete source dialog
function del_src_button_ok(){
  var i1, i2, srcl, ta=[], il=inputs.length;
  // remove the particular source out of sources array
  sources.splice(src_del, 1);
  // for each input, check if uses source
  for(i1=0; i1<il; i1++){
    // get which sources the input uses
    srcl=inputs[i1].data("sys_src").length;
    // for each source input uses
    for(i2=0; i2<srcl; i2++){
      // if input uses particular source
      if(inputs[i1].data("sys_src")[i2]==src_del){
        // remove source
        ta=inputs[i1].data("sys_src");
        ta.splice(i2, 1);
        inputs[i1].data("sys_src", ta);
        ta=[];
        srcl--;
      }
    }
    // after removing particular source from input sources
    srcl=inputs[i].data("sys_src").length;
    // for each source input uses
    for(i2=0; i2<srcl; i2++){
      // if uses a higher index source, bump down index by one
      if(inputs[i1].data("sys_src")[i2]>src_del){
        ta=inputs[i1].data("sys_src");
        ta[i2]=ta[i2]-1;
        inputs[i1].data("sys_src", ta);
        ta=[];
      }
    }
  }
  // set working source index to -1
  src_del=-1;
  // close and reopen sources dialog
  del_src_dialog.dialog("close");
  src_dialog.dialog("close");
  $("#Sources").click();
}

// del_src_button_cancel performs the cancel button action of the delete source
// dialog
function del_src_button_cancel(){
  // close the dialog
  del_src_dialog.dialog("close");
}

// *** Delete Input *** //

// del_inp_button_yes performs the yes button action of the delete input dialog
function del_inp_button_yes(){
  // remove the particular input and label Raphaeljs object
  inputs[inp_del].remove();
  input_labels[inp_del].remove();
  // delete the particular input and label from the input and label arrays
  inputs.splice(inp_del,1);
  input_labels.splice(inp_del,1);
  // since system has changed, everything must be recalculated, set flags false
  flags.J=false;
  flags.W=false;
  flags.Nu=false;
  flags.U=false;
  $("#u_sum").remove();
  flags.UMF=false;
  $("#umf_sum").remove();
  flags.UPC=false;
  $("#upc_sum").remove();
  // close and reopen input dialog
  del_inp_dialog.dialog("close");
  inp_dialog.dialog("close");
  $("#Inputs").click();
}

// del_inp_button_cancel performs the no button action of the delete input
// dialog
function del_inp_button_no(){
  // close the dialog
  del_inp_dialog.dialog("close");
}

// *** Delete Component *** //

// del_comp_button_yes performs the yes button action of the delete component
// dialog
function del_comp_button_yes(){
  var conl=connections.length, temp_con=[];
  // for each connection
  for(i=0; i<conl; i++){
    // if connection is connected to particular component, remove connection
    if(connections[i].to.data("variable")==
      components[comp_del].data("variable")){
      connections[i].line.remove();
      connections[i].arr.remove();
    // if connection is connected, keep
    } else {
      temp_con.push(connections[i]);
    }
  }
  // set connenctions to all connections kept
  connections=temp_con;
  // remove the particular component and label Raphaeljs object
  components[comp_del].remove();
  component_labels[comp_del].remove();
  // delete the component and label from the component and labal array
  components.splice(comp_del,1);
  component_labels.splice(comp_del,1);
  // since system has changes, everything must be recalculated, set flags false
  flags.J=false;
  flags.W=false;
  flags.U=false;
  $("#u_sum").remove();
  flags.UMF=false;
  $("#umf_sum").remove();
  flags.UPC=false;
  $("#upc_sum").remove();
  // close and reopen component dialog
  del_comp_dialog.dialog("close");
  comp_dialog.dialog("close");
  $("#Components").click();
}

// del_comp_button_cancel performs the no button action of the delete
// component dialog
function del_comp_button_no(){
  // close the dialog
  del_comp_dialog.dialog("close");
}

//***************************** Summary dialogs ******************************//
// *** Dataset Summary *** //

// sum_ds_button_export_csv performs the export csv button action of the dataset
// summary dialog
function sum_ds_button_export_csv(){
  // export the dataset summary to csv
  saveCSV(ds2CSV(),'datasets.csv');
}

// sum_ds_button_ok performs the ok button action of the dataset summary
// dialog
function sum_ds_button_ok(){
  // close the dialog
  sum_ds_dialog.dialog("close");
}

// *** Source Summary *** //

// sum_src_button_export_csv performs the export csv button action of the
// source summary dialog
function sum_src_button_export_csv(){
  // export the source summary to csv
  saveCSV(src2CSV(),'sources.csv');
}

// sum_src_button_ok performs the ok button action of the source summary
// dialog
function sum_src_button_ok(){
  // close the dialog
  sum_src_dialog.dialog("close");
}

// *** Input Summary *** //

// sum_inp_button_export_csv performs the export csv button action of the input
// summary dialog
function sum_inp_button_export_csv(){
  // export the input summary to csv
  saveCSV(inp2CSV(),'inputs.csv');
}

// sum_inp_button_ok performs the ok button action of the input summary
// dialog
function sum_inp_button_ok(){
  // close the dialog
  sum_inp_dialog.dialog("close");
}

// *** Component Summary *** //

// sum_comp_button_export_csv performs the export csv button action of the
// component summary dialog
function sum_comp_button_export_csv(){
  // export the component summary to csv
  saveCSV(comp2CSV(),'components.csv');
}

// sum_comp_button_ok performs the ok button action of the component summary
// dialog
function sum_comp_button_ok(){
  // close the dialog
  sum_comp_dialog.dialog("close");
}

// *** Correlation Summary *** //

// sum_corr_button_export_csv performs the export csv button action of the
// correlation summary dialog
function sum_corr_button_export_csv(){
  // export the correlation summary to csv
  saveCSV(corr2CSV(),'correlations.csv');
}

// sum_corr_button_ok performs the ok button action of the correlation summary
// dialog
function sum_corr_button_ok(){
  // close the dialog
  sum_corr_dialog.dialog("close");
}

// *** Component Total Uncertainty Summary

// sum_u_button_export_csv performs the export csv button action of the
// component total uncertainty summary dialog
function sum_u_button_export_csv(){
  // export the component total uncertainty summary to csv
  saveCSV(U2CSV(),'totu.csv');
}

// sum_u_button_ok performs the ok button action of the component total
// uncertainty dialog
function sum_u_button_ok(){
  // close the dialog
  sum_u_dialog.dialog("close");
}

// *** Uncertainty Magnification Factor Summary *** //

// sum_umf_button_export_csv performs the export csv button action of the
// uncertainty magnification factor summary dialog
function sum_umf_button_export_csv(){
  // export the uncertainty magnification factor summary to csv
  saveCSV(UMF2CSV(),'umf.csv');
}

// sum_umf_button_ok performs the ok button action of the uncertainty
// magnification factor dialog
function sum_umf_button_ok(){
  // close the dialog
  sum_umf_dialog.dialog("close");
}

// *** Uncertainty Percent Contribution *** //

// sum_upc_button_export_csv performs the export csv button action of the
// uncertainty percent contribution summary dialog
function sum_upc_button_export_csv(){
  // export the uncertainty percent contribution summary to csv
  saveCSV(UPC2CSV(),'upc.csv');
}

// sum_upc_button_ok performs the ok button action of the uncertainty
// percent contribution dialog
function sum_upc_button_ok(){
  // close the dialog
  sum_upc_dialog.dialog("close");
}

// *** Apply Dataset to Input Nominal Value *** //

// apply_ds_2_nom_button_ok performs the ok button action of the apply dataset
// to input nominal value dialog
function apply_ds_2_nom_button_ok(){
  // get the index of the selected dataset
  ds_nom=Number($("input[name=ds]:checked").val());
  // if the index is undefined, no dataset selected
  if(typeof ds_nom=="undefined"){
    // warn no dataset selected
    $("body").append("<div id='warn' class='dialog' title='No Dataset Select'>\
      <p>No dataset selected. Please select a dataset before proceeding.</p>\
      </div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  // if dataset selected
  } else {
    // calculate mean value and set nominal value field to mean
    $("#add_inp_nominal").val(mu(datasets[ds_nom].values));
    $("#edit_inp_nominal").val(mu(datasets[ds_nom].values));
    // close the apply dataset to input nominal value dialog
    apply_ds_2_nom_dialog.dialog("close");
  }
}

// apply_ds_2_nom_cancel performs the cancel button action of the apply dataset
// to input nominal value dialog
function apply_ds_2_nom_button_cancel(){
  // close the dialog
  apply_ds_2_nom_dialog.dialog("close");
}

// *** Apply Dataset to Input Random Uncertainty Value *** //

// apply_ds_2_rand_button_ok performs the ok button action of the apply dataset
// to input random uncertainty value dialog
function apply_ds_2_rand_button_ok(){
  var n, mean, rand;
  // get the index of the selected dataset
  ds_rand=Number($("input[name=ds]:checked").val());
  // if the index is undefined, no dataset selected
  if(typeof ds_rand=="undefined"){
    // warn no dataset selected
    $("body").append("<div id='warn' class='dialog' title='No Dataset Select'>\
      <p>No dataset selected. Please select a dataset before proceeding.</p>\
      </div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  // if dataset selected
  } else {
    // calculate N, mean, and random uncertainty value
    n=num_samples(datasets[ds_rand].values);
    mean=mu(datasets[ds_rand].values);
    rand=t_dist(n)*sig(datasets[ds_rand].values, mean)/Math.pow(n,1/2);
    // set random uncertainty value field to calculated value
    $("#add_inp_random").val(rand);
    $("#edit_inp_random").val(rand);
    // close the apply dataset to input random uncertainty value dialog
    apply_ds_2_rand_dialog.dialog("close");
  }
}

// apply_ds_2_rand_cancel performs the cancel button action of the apply dataset
// to input random uncertainty value dialog
function apply_ds_2_rand_button_cancel(){
  // close the dialog
  apply_ds_2_rand_dialog.dialog("close");
}

// *** Apply Sources to Input Systematic Uncertainty Value *** //

// apply_src_2_sys_button_ok performs the ok button action of the apply source
// to input systematic uncertainty sources dialog
function apply_src_2_sys_button_ok(){
  var i, srcl, mess="", src_select=[];
  // get index of all selected sources
  $(".src").each(function(i){
    if(this.checked){src_select.push(i);}
  });
  // set selected sources to global variable src_sys
  src_sys=src_select;
  // get the number of selected sources
  srcl=src_sys.length;
  // if no sources selected
  if(srcl==0){
    // change text to indicate no sources selected
    $("#src_select").text("No sources have been selected. If no source(s) are \
      selected, a value of zero will be used.");
  // if one source selected
  } else if(srcl==1){
    // change text to indicate what source selected
    $("#src_select").text("Source id "+src_sys[0]+" selected.");
  // if more than one source selected
  } else {
    // change text to indicate what sources selected
    mess="";
    for(i=0; i<srcl-1; i++){mess+=src_sys[i]+", ";}
    mess+=" and "+src_sys[srcl-1];
    $("#src_select").text("Source ids "+mess+" selected.");
  }
  // close the apply source to input systematic uncertainty source dialog
  apply_src_2_sys_dialog.dialog("close");
}

// apply_src_2_sys_cancel performs the cancel button action of the apply source
// to input systematic uncertainty source dialog
function apply_src_2_sys_button_cancel(){
  // close the dialog
  apply_src_2_sys_dialog.dialog("close");
}

//**************************** Calculate dialogs *****************************//

// *** Calculate Component Total Uncertainty *** //

// calc_u_button_view_results performs the view results button action of the
// calculate compontent total uncertainty dialog
function calc_u_button_view_results(){
  // close the dialog
  calc_u_dialog.dialog("close");
  // simulate clicking of component total uncertainty summary
  $("#sum_u").click();
}

// calc_u_button_add_components performs the add components button action of the
// calculate compontent total uncertainty dialog
function calc_u_button_add_components(){
  // close the dialog
  calc_u_dialog.dialog("close");
  // simulate clicking of components dialog
  $("#Components").click();
}

// calc_u_button_add_inputs performs the add inputs button action of the
// calculate compontent total uncertainty dialog
function calc_u_button_add_inputs(){
  // close the dialog
  calc_u_dialog.dialog("close");
  // simulate clicking of inputs dialog
  $("#Inputs").click();
}

// calc_u_button_ok performs the ok button action of the calculate component
// total uncertainty dialog
function calc_u_button_ok(){
  // close the dialog
  calc_u_dialog.dialog("close");
}

// *** Calculate Uncertainty Magnification Factor *** //

// calc_umf_button_view_results performs the view results button action of the
// calculate uncertainty magnification factor dialog
function calc_umf_button_view_results(){
  // close the dialog
  calc_umf_dialog.dialog("close");
  // simulate clicking of uncertainty magnification factor summary
  $("#sum_umf").click();
}

// calc_umf_button_add_components performs the add components button action of
// the calculate uncertainty magnification factor dialog
function calc_umf_button_add_components(){
  // close the dialog
  calc_umf_dialog.dialog("close");
  // simulate clicking of components dialog
  $("#Components").click();
}

// calc_umf_button_add_inputs performs the add inputs button action of the
// calculate uncertainty magnification factor dialog
function calc_umf_button_add_inputs(){
  // close the dialog
  calc_umf_dialog.dialog("close");
  // simulate clicking of inputs dialog
  $("#Inputs").click();
}

// calc_umf_button_ok performs the ok button action of the calculate uncertainty
// magnification factor dialog
function calc_umf_button_ok(){
  // close the dialog
  calc_umf_dialog.dialog("close");
}

// *** Calculate Uncertainty Percent Contribution *** //

// calc_upc_button_view_results performs the view results button action of the
// calculate uncertainty percent contribution dialog
function calc_upc_button_view_results(){
  // simulate clicking of uncertainty percent contribution summary
  $("#sum_upc").click();
  // close the dialog
  calc_upc_dialog.dialog("close");
}

// calc_upc_button_add_components performs the add components button action of
// the calculate uncertainty percent contribution dialog
function calc_upc_button_add_components(){
  // close the dialog
  calc_upc_dialog.dialog("close");
  // simulate clicking of components dialog
  $("#Components").click();
}

// calc_umf_button_add_inputs performs the add inputs button action of the
// calculate uncertainty percent contribution dialog
function calc_upc_button_add_inputs(){
  // close the dialog
  calc_upc_dialog.dialog("close");
  // simulate clicking of inputs dialog
  $("#Inputs").click();
}

// calc_upc_button_ok performs the ok button action of the calculate uncertainty
// percent contribution dialog
function calc_upc_button_ok(){
  // close the dialog
  calc_upc_dialog.dialog("close");
}

//******************************* File dialogs *******************************//

// *** Exit *** //

// exit_button_yes performs the yes button action of the exit dialog
function exit_button_yes(){
  // close the dialog
  exit_dialog.dialog("close");
  // empty entire page
  $("body").empty();
  // display goodbay message
  $("body").append("<div style='position:absolute; height:95%; width:95%; \
    display:table'><h1 style='display:table-cell; vertical-align:middle; \
    text-align:center;'>See you later!</h1></div>");
}

// exit_button_no performs the no button action of the exit dialog
function exit_button_no(){
  // close the dialog
  exit_dialog.dialog("close");
}

// *** New *** //

// new_button_yes performs the yes button action of the new dialog
function new_button_yes(){
  // close the dialog
  new_dialog.dialog("close");
  // reload page
  location.reload();
}

// new_button_no performs the no button action of the new dialog
function new_button_no(){
  // close the dialog
  new_dialog.dialog("close");
}

// *** Save *** //

// save_button_save_as performs the save as button action of the save dialog
function save_button_save_as(){
  // get the entered filename
  var filename=$("#save_filename").val().trim();
  // if filename is not blank
  if(filename.length>0){
    // export the system, and save file
    save_data(export_canvas(),filename+'.ujs');
    // close the dialog
    save_dialog.dialog("close");
  // if filename is blank
  } else {
    // warn filename is blank
    $("body").append("<div id='warn' class='dialog' title='Warning'><p>Filename\
      is required.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

// save_button_no performs the no button action of the save dialog
function save_button_cancel(){
  // close the dialog
  save_dialog.dialog("close")
}

function error_send(){
  let fieldIDs=['entry.1244551315', 'entry.217310529'];
  let fieldVals=[browser(), eStack];
  let url='https://docs.google.com/forms/d/e/1FAIpQLScDfEAmmr1NQxLamEj_BRSZorZhzoMLceG-M-W_djF_5wrc0Q/formResponse';
  url+='?';
  fieldIDs.forEach(function(cv1, i1, arr1){
    url+=cv1+'='+encodeURI(fieldVals[i1])+'&';
  });
  url=url.slice(0, -1);
  window.open(url);
  error_dialog.dialog("close");
}

function error_cancel(){
  eStack='';
  error_dialog.dialog("close");
}

//****************************************************************************//
//                                                                            //
//                           Calculation Functions                            //
//                                                                            //
//****************************************************************************//
// These functions calculate the various quantities for the modular           //
// uncertainty calculations.                                                  //
//****************************************************************************//

// t_dist calculates the t table value given the number of samples
function t_dist(n){
  var i, vs, v=[], t=[];
  // get the degrees of freedom
  n=n-1;
  // t table values for 95% confidence
  v=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,
    28,29,30,40,60,80,100,1000];
  t=[12.71,4.303,3.182,2.776,2.571,2.447,2.365,2.306,2.262,2.228,2.201,2.179,
    2.16,2.145,2.131,2.12,2.11,2.101,2.093,2.086,2.08,2.074,2.069,2.064,2.06,
    2.056,2.052,2.048,2.045,2.042,2.021,2,1.99,1.984,1.962];
  vs=v.length;
  // check if DOF is valid
  if(n<=0 || isNaN(n)){
    return "Invalid degrees of freedom.";
  }
  // interpolate to calculate values
  for(i=0; i<vs-1; i++){
    if(v[i]==n){
      return t[i];
    } else if(v[i]<n && v[i+1]>n){
      return ((n-v[i])/(v[i+1]-v[i]))*(t[i+1]-t[i])+t[i];
    }
  }
  return t[t.length-1];
}

// num_samples calculates the number of an array of samples
function num_samples(str_arr){
  return str_arr.length;
}

// mu calculates the mean value of an array of samples
function mu(str_arr){
  var i, n, mean=0;
  // calculate the number of samples
  n=num_samples(str_arr);
  // sum the samples
  for(i=0; i<n; i++){mean+=str_arr[i];}
  // return mean
  return mean/n;
}

// sig calculate the standard deviation of an array of samples
function sig(str_arr, mean){
  var i, n, stdev=0;
  // calculate the number of samples
  n=num_samples(str_arr);
  // sum the squares of the differences of the samples and mean
  for(i=0; i<n; i++){stdev+=Math.pow(str_arr[i]-mean, 2);}
  // return the standard deviation
  return Math.pow(stdev/(n-1), 1/2);
}

// inp_by_syc_mat returns a 2D array of the systematic uncertainty sources
function inp_by_sys_mat(){
  var i1, i2, res=[], il=inputs.length, srcl=sources.length;
  // for each input
  for(i1=0; i1<il; i1++){
    res[i1]=[];
    // for each source
    for(i2=0; i2<srcl; i2++){
      if($.inArray(i2+1, inputs[i1].data("sys_src"))>=0){
        res[i1].push(sources[i2].value);
      } else {
        res[i1].push(0);
      }
    }
  }
  return res;
}

// ns_nc returns a 2D array of the uncorrelated and correlated systematic
// uncertainty sources
function ns_nc(){
  var i1, i2, count, nsm, u=[], c=[], cl, il=inputs.length, srcl=sources.length;
  nsm=inp_by_sys_mat();
  // for each input, create zero array
  for(i1=0; i1<il; i1++){u.push(0);}
  // for each source
  for(i1=0; i1<srcl; i1++){
    count=0;
    // for each input
    for(i2=0; i2<il; i2++){
      // if 2D array of systematic uncertainty sources is nonzero
      if(nsm[i2][i1]!=0){count++;}
      // if two values of 2D array are nonzero, end for loop
      if(count>1){i2=il;}
    }
    // if only one nonzero, value is uncorrelated source
    if(count==1){
      // sum squares of uncorrelated sources
      for(i2=0; i2<il; i2++){
        if(nsm[i2][i1]!=0){u[i2]+=Math.pow(nsm[i2][i1],2);}
      }
    }
  }
  // take square root of uncorrelated sources
  for(i1=0; i1<il; i1++){u[i1]=Math.pow(u[i1],1/2);}
  // for each source
  for(i1=0; i1<srcl; i1++){
    count=0;
    // for each input
    for(i2=0; i2<il; i2++){
      // if 2D array of systematic uncertainty sources is nonzero
      if(nsm[i2][i1]!=0){count++;}
    }
    // if two values of 2D array are non zero, value is correlated source
    if(count>1){
      // create correlated 2D array
      c.push([]);
      cl=c.length;
      for(i2=0; i2<il; i2++){
        if(nsm[i2][i1]!=0){
          c[cl-1].push(nsm[i2][i1]);
        } else {
          c[cl-1].push(0);
        }
      }
    }
  }
  // return uncorrlated, and correlated sources
  return {ns:u, nc:c};
}

// calc_comp_nom calculates the components nominal values
function calc_comp_nom(){
  var i, il=inputs.length, cl=components.length, noms=[], p=math.parser();
  // for each input
  for(i=0; i<il; i++){
    // add variable definition to mathjs workspace
    p.eval(inputs[i].data("variable")+"="+inputs[i].data("nominal"));
  }
  // for each component
  for(i=0; i<cl; i++){
    // get mathjs to calculate component nominal value
    components[i].data("nominal",p.eval(components[i].data("variable")+"="+
      components[i].data("fun")));
  }
}

// calc_J calculates the Jacobian matrix of the components wrt to the inputs
function calc_J(){
  // if Jacobian is not already calculated
  if(!flags.J){
    // if there are inputs and components
    if(inputs.length>0 && components.length>0){
      // get input nominal values, and variables
      var inp_nom=dataToArray(inputs, "nominal");
      var inp_var=dataToArray(inputs, "variable");
      // get component variables, and functions
      var comp_var=dataToArray(components, "variable");
      var com_fun=dataToArray(components, "fun");
      var i1, i2, J_inp, J_com, comp_nom=[], J_inp_com=[], J_temp=[], c_j, r;
      // get the number of inputs and components
      var il=inp_var.length;
      var cl=comp_var.length;
      var icl=il+cl;
      // define mathjs parser
      var p=math.parser();
      // for each input and component, define variable as nominal value
      for(i1=0; i1<il; i1++){p.eval(inp_var[i1]+"="+inp_nom[i1]);}
      for(i1=0; i1<cl; i1++){
        comp_nom.push(p.eval(comp_var[i1]+"="+com_fun[i1]));
      }
      // for each component, define function
      var inp_comp_nom=inp_nom.concat(comp_nom);
      var inp_comp_var=inp_var.concat(comp_var);
      var inp_com_args=inp_comp_var.join();
      var c=math.complex(inp_comp_nom);
      p.clear();
      for(i1=0; i1<cl; i1++){
        p.eval(comp_var[i1]+"("+inp_com_args+")="+com_fun[i1]);
      }
      // calculate Jacobian of components wrt to inputs and components
      for(i1=0; i1<icl; i1++){
        J_temp=[];
        if(i1!=0){c[i1-1].im=0;}
        c[i1].im=Number.EPSILON;
        c_j=c.join();
        for(i2=0; i2<cl; i2++){
          r=p.eval(comp_var[i2]+"("+c_j+")").im/Number.EPSILON;
          if(r){
            J_temp.push(r);
          } else {
            J_temp.push(0);
          }
        }
        J_inp_com.push(J_temp);
      }
      J_inp_com=math.transpose(math.matrix(J_inp_com));
      // seperate the two parts of the Jacobian of the components
      J_inp=J_inp_com.subset(math.index(math.range(0,cl),math.range(0,il)));
      J_com=J_inp_com.subset(math.index(math.range(0,cl),math.range(il,icl)));
      // calculate the Jacobian of the components wrt to solely the inputs
      J=math.multiply(math.inv(math.add(math.eye(cl),math.multiply(-1,J_com))),
        J_inp);
      J=J.valueOf();
      flags.J=true;
    }
  }
  return true;
}

// calc_Nu calculates the input total uncertainty
function calc_Nu(){
  // if input total uncertainty is not already calculated
  if(!flags.Nu){
    // if there are inputs and componets
    if(inputs.length>0 && components.length>0){
      // get input random uncertainty values
      var nr=dataToArray(inputs, "random");
      var i1, i2, ns=inputs.length;
      var Ns, Nr, Nc;
      // get input systematic uncertainty and correlation values
      var nsc=ns_nc();
      Ns=math.diag(math.matrix(nsc.ns));
      Nc=nsc.nc;
      // if correlations exist, augment systematic and correlation together
      if(Nc.length>0){
        Nc=math.transpose(math.matrix(Nc));
        Ns=math.concat(Ns,Nc);
      }
      // calculate the input total uncertainty
      Ns=math.multiply(Ns,math.transpose(Ns));
      Nr=math.diag(math.matrix(nr));
      Nr=math.multiply(Nr,math.transpose(Nr));
      Nu=math.add(Nr,Ns);
      if(math.size(Nu).valueOf().length==0){
        Nu=[Nu.valueOf()];
      } else {
        Nu=Nu.valueOf();
      }
      flags.Nu=true;
    }
  }
  return true;
}

// calc_W calculates the squared of the Jacobian matrix
function calc_W(){
  // if W is not already calculated
  if(!flags.W){
    // if there are input and componets
    if(inputs.length>0 && components.length>0){
      // calculate the Jacobian matrix
      calc_J();
      var Jmat=math.matrix(J);
      // square each element of the Jacobian matrix
      W=math.square(Jmat).valueOf();
      flags.W=true;
    }
  }
  return true;
}

// calc_U calculates the component total uncertainty
function calc_U(){
  // if component total uncertainty is not already calculated
  if(!flags.U){
    // if there are inputs and components
    if(inputs.length>0 && components.length>0){
      // calculate the Jacobian and input total uncertainty matrix
      calc_J();
      calc_Nu();
      var Numat=math.matrix(Nu);
      var Jmat=math.matrix(J);
      // calculate the component total uncertainty matrix
      var Cu=math.multiply(math.multiply(Jmat,Numat),math.transpose(Jmat));
      if(math.size(Cu).valueOf().length==0){
        U=[Math.pow(Cu,1/2)];
      } else {
        U=math.sqrt(math.diag(Cu)).valueOf();
      }
      flags.U=true;
    }
  }
  // add component total uncertainty summary link
  if($("#sum_u").length==0){
    if($("#sum_umf").length>0){
      $("<li><a id='sum_u'>Component Total Uncertainty Summary</a></li>")
        .insertBefore($("#sum_umf").parent());
    } else if($("#sum_upc").length>0){
      $("<li><a id='sum_u'>Component Total Uncertainty Summary</a></li>")
        .insertBefore($("#sum_upc").parent());
    } else {
      $("#view").append("<li><a id='sum_u'>Component Total Uncertainty Summary\
        </a></li>");
    }
  }
  // add click event to component total uncertainty summary link
  $("#sum_u").click(function(){
    sum_u_dialog.dialog("open");
    event.preventDefault();
  });
  return true;
}

// calc_UMF calculates the uncertainty magnification factor
function calc_UMF(){
  // if uncertainty magnification factor is not already calculated
  if(!flags.UMF){
    // calculate the Jacobian matrix
    calc_J();
    var Jmat=math.matrix(J);
    // build input and component nominal value matrices
    var Nv=math.diag(math.matrix(dataToArray(inputs, "nominal")));
    var Cv=math.diag(math.matrix(dataToArray(components, "nominal")));
    // calculate the uncertainty magnification factor
    UMF=math.multiply(math.multiply(math.inv(Cv),J),Nv).valueOf();
    flags.UMF=true;
  }
  // add uncertainty magnification factor summary link
  if($("#sum_umf").length==0){
    if($("#sum_upc").length>0){
      $("<li><a id='sum_umf'>Component Uncertainty Magnification Factor \
        Summary</a></li>").insertBefore($("#sum_upc").parent());
    } else {
      $("#view").append("<li><a id='sum_umf'>Component Uncertainty \
        Magnification Factor Summary</a></li>");
    }
  }
  // add click event to uncertainty magnification factor summary link
  $("#sum_umf").click(function(){
    sum_umf_dialog.dialog("open");
    event.preventDefault();
  });
  return true;
}

// calc_UPC calculates the uncertainty percent contribution
function calc_UPC(){
  // if uncertainty percent contribution is not alread calculated
  if(!flags.UPC){
    // if there are inputs and components
    if(inputs.length>0 && components.length>0){
      // calculate the W, and input total uncertainty matrices
      calc_W();
      calc_Nu();
      var Wmat=math.matrix(W);
      var Numat=math.matrix(Nu);
      var Umat=math.multiply(Wmat, math.diag(Numat));
      Numat=math.diag(math.diag(Numat));
      // if there is only one component
      if(components.length==1){
        // calculate the uncertainty percent contribution when Umat is a scalar
        UPC=math.multiply(math.inv(Umat), math.multiply(Wmat, Numat)).valueOf();
      // when there is not one component
      } else {
        // calcualte the uncertainty percent contribution when Umat is a matrix
        UPC=math.multiply(math.inv(math.diag(Umat)), math.multiply(Wmat, Numat))
          .valueOf();
      }
      flags.UPC=true;
    }
  }
  // add uncertainty percent contribution summary link
  if($("#sum_upc").length==0){
    $("#view").append("<li><a id='sum_upc'>Component Uncertainty Percent \
      Contribution Summary</a></li>");
  }
  // add click event to uncertainty percent contribution summary link
  $("#sum_upc").click(function(){
    sum_upc_dialog.dialog("open");
    event.preventDefault();
  });
  return true;
}

//****************************************************************************//
//                                                                            //
//                            Formatting Functions                            //
//                                                                            //
//****************************************************************************//
// These functions perform various formatting task.                           //
//****************************************************************************//

// resize resizes the Jquery handle supplied
function resize(hdl){
  // if the dialog is open
  if(hdl.dialog("isOpen")){
    // if the width of the dialog is larger than 90% of the window width
    if(hdl.width()>=$(window).width()*0.9){
      // set width to 90% of the window width
      hdl.dialog({width: $(window).width()*0.9});
    // if the width of the dialog is smaller than 90% of the window width
    } else {
      // set width to auto
      hdl.dialog({width: 'auto'});
    }
    // if the height of the dialog is larger than 90% of the window height
    if(hdl.height()>=$(window).height()*0.9){
      // set height to 90% of the window heigth
      hdl.dialog({height: $(window).height()*0.9});
    // if the height of the dialog is smaller than 90% of the window height
    } else {
      // set height to auto
      hdl.dialog({height: 'auto'});
    }
  }
}

// engFormat displays numerics in a pleasing manner
function engFormat(num){
  /*if(typeof num!=='number'){
    num=parseFloat(num);
    if(isNaN(num)){num=0;}
  }*/
  if(num==0){
    return num;
  } else if(num>0 && num<1){
    return num.toExponential(3);
  } else if(num>=1 && num<10) {
    return Math.round(num*1000)/1000;
  } else if(num>=10 && num<100){
    return Math.round(num*100)/100;
  } else if(num>=100 && num<1000){
    return Math.round(num*10)/10;
  } else {
    return num.toExponential(3);
  }
}

// svg_label converts sub and sup tags to svg equivalents
function svg_label(label){
  // replace opening sub and sup tags with opening tspan tag with baseline shift
  label=label.replace(/<sub>/g, "<tspan baseline-shift='sub'>");
  label=label.replace(/<sup>/g, "<tspan baseline-shift='super'>");
  // replace closing sub and sup tags with closing tspan tag
  label=label.replace(/<\/sub>/g, "</tspan>");
  label=label.replace(/<\/sup>/g, "</tspan>");
  return label;
}

// get_text_size measures the width and height of text
function get_text_size(txt){
  // add invisible span tag to wrap text in
  $("body").append("<span id='ruler' style='visibility:hidden; \
    white-space:nowrap;'>"+txt+"</span>");
  // get width and height of text in span tag
  var s=[$("#ruler").width(), $("#ruler").height()];
  // remove span tag
  $("#ruler").remove();
  // return width and height
  return s;
}

//****************************************************************************//
//                                                                            //
//                        Saving and Output Functions                         //
//                                                                            //
//****************************************************************************//
// These functions perform various tasks that result in the output of data in //
// particular formats and also the saving of data.                            //
//****************************************************************************//

// ds_str_2_arr turns a dataset string into an array
function ds_str_2_arr(str){
  var str, str_arr, n, i;
  // replace any newlines or carriage returns to just a newline
  str=str.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "");
  // split the string by newlines
  str_arr=str.split("\n");
  // get the number of values
  n=str_arr.length;
  // for each value, turn string number into array element
  for(i=0; i<n; i++){str_arr[i]=Number(str_arr[i].trim());}
  // return array
  return str_arr;
}

// ds2CSV turns dataset summary into a CSV string
function ds2CSV(){
  var i, n, mean, stdev, dsl=datasets.length, str='id,name,N,mean,stdev\r\n';
  // for each dataset
  for(i=0; i<dsl; i++){
    // calcualte N, mean, and standard deviation
    n=num_samples(datasets[i].values);
    mean=mu(datasets[i].values);
    stdev=sig(datasets[i].values, mean);
    // add dataset values to output string
    str+=(i+1)+","+datasets[i].name+","+n+","+mean+","+stdev+'\r\n';
  }
  return str;
}

// src2CSV turns source summary into a CSV string
function src2CSV(){
  var i, n, srcl=sources.length, str='id,name,value\r\n';
  // for each sourece
  for(i=0; i<srcl; i++){
    // add source values to output string
    str+=(i+1)+","+sources[i].name+","+sources[i].value+'\r\n';
  }
  return str;
}

// inp2CSV turns input summary into a CSV string
function inp2CSV(){
  var i1, i2, srcl, il=inputs.length, str='id,name,variable,label,nominal,';
  str+='nominal ds,random,random ds,systematic src\r\n';
  // for each input
  for(i1=0; i1<il; i1++){
    // add name, variable, and nominal value to output string
    str+=(i1+1)+","+inputs[i1].data("name")+","+inputs[i1].data("variable")+",";
    str+=inputs[i1].data("label")+","+inputs[i1].data("nominal")+",";
    // if nominal value is not linked to dataset, state dataset as 0
    if(inputs[i1].data("nom_ds")==-1){
      str+="0,";
    // if nominal value is linked to dataset, state dataset
    } else {
      str+=(inputs[i1].data("nom_ds")+1)+",";
    }
    // add random value to output string
    str+=inputs[i1].data("random")+",";
    // if random value is not linked to dataset, state dataset as 0
    if(inputs[i1].data("rand_ds")==-1){
      str+="0,";
    // if random value is linked to dataset, state dataset
    } else {
      str+=(inputs[i1].data("rand_ds")+1)+",";
    }
    // if systematic is not linked to source, state source as 0
    if(inputs[i1].data("sys_src").length==0){
      str+="0";
    // if systematic is linked to source(s), state source(s)
    } else {
      srcl=inputs[i1].data("sys_src").length;
      for(i2=0; i2<srcl-1; i2++){str+=inputs[i1].data("sys_src")[i2]+" ";}
      str+=inputs[i1].data("sys_src")[srcl-1];
    }
    // add carriage return and newline
    str+='\r\n';
  }
  return str;
}

// comp2CSV turns component summary into a CSV string
function comp2CSV(){
  var i, cl=components.length, str='id,name,variable,label,function,';
  str+='nominal\r\n';
  // calculate the components nominal value
  calc_comp_nom();
  // for each component
  for(i=0; i<cl; i++){
    // add name, variable, label, function, and nominal value to output string
    str+=(i+1)+","+components[i].data("name")+",";
    str+=components[i].data("variable")+","+components[i].data("label")+",";
    str+=components[i].data("fun")+","+components[i].data("nominal")+'\r\n';
  }
  return str;
}

// corr2CSV turns correlation summary into a CSV string
function corr2CSV(){
  var i1, i2, il=inputs.length, nc, ncs, str='id,name,';
  // correlation matrix
  nc=ns_nc().nc;
  // get number of correlations
  ncs=nc.length;
  // for each correlation, add correlation number to output string
  for(i1=0; i1<ncs-1; i1++){str+="c"+(i1+1)+",";}
  str+="c"+(ncs-1)+'\r\n';
  // for each input, add correlation value
  for(i1=0; i1<il; i1++){
    str+=(i1+1)+","+inputs[i1].data("name")+",";
    for(i2=0; i2<ncs-1; i2++){str+=nc[i2][i1]+",";}
    str+=nc[ncs-1][i1]+'\r\n';
  }
  return str;
}

// U2CSV turns component total uncertainty summary into a CSV string
function U2CSV(){
  var i, cl=components.length, str='id,component,total uncertainty,percent ';
  str+='uncertainty\r\n';
  // for each component
  for(i=0; i<cl; i++){
    // add variable, total uncertainty, and percent uncertainty to output string
    str+=(i+1)+","+components[i].data("variable")+","+U[i]+","+(100*U[i]/
      Number(components[i].data("nominal")))+'\r\n';
  }
  return str;
}

// UMF2CSV turns uncertainty magnification factor summary into a CSV string
function UMF2CSV(){
  var i1, i2, il=inputs.length, cl=components.length, str='id,component';
  // for each input, add input variable to output string
  for(i1=0; i1<il; i1++){str+=","+inputs[i1].data("variable");}
  str+="\r\n";
  // for each component
  for(i1=0; i1<cl; i1++){
    // add component variable to output string
    str+=(i1+1)+","+components[i1].data("variable");
    // for each input, add component UMF value to output string
    for(i2=0; i2<il; i2++){str+=","+Math.abs(UMF[i1][i2]);}
    str+="\r\n";
  }
  return str;
}

// UPC2CSV turns uncertainty percent contribution summary into a CSV string
function UPC2CSV(){
  var i1, i2, il=inputs.length, cl=components.length, str='id,component';
  // for each input, add input variable to output string
  for(i1=0; i1<il; i1++){str+=","+inputs[i1].data("variable");}
  str+="\r\n";
  // for each component
  for(i1=0; i1<cl; i1++){
    // add component variable to output string
    str+=(i1+1)+","+components[i1].data("variable");
    // for each inpupt, add component UPC value to output string
    for(i2=0; i2<il; i2++){str+=","+Math.abs(100*UPC[i1][i2]);}
    str+="\r\n";
  }
  return str;
}

// saveCSV saves the CSV string to a file with the name filename
function saveCSV(str, filename){
  // create a tag and add to body
  var a=document.createElement("a");
  document.body.appendChild(a);
  // set a tag id and style to not display
  a.id='file_download';
  a.style="display: none";
  // set target to _blank
  a.target="_blank";
  // set download to filename
  a.download=filename;
  // add CSV string to the href
  var csvData="data:application/csv;charset=utf-8,"+encodeURIComponent(str);
  a.href=csvData;
  // simulate click of a tag
  a.click();
  // remove the a tag
  $("#file_download").remove();
}

// export_canvas exports the current system so that it may be saved
function export_canvas(){
  var il=inputs.length, cl=components.length, dsl=datasets.length,
    srcl=sources.length, i, exp={inp:[], comp:[], ds:[], src:[], J:[],
    viewbox:viewbox, zoom:zoom, flags:[], W:[], Nu:[], U:[], UMF:[], UPC:[]};
  // for each input
  for(i=0; i<il; i++){
    // get x, y, width, and height
    var ox=inputs[i].attr("cx")-inputs[i].attr('rx');
    var oy=inputs[i].attr("cy")-inputs[i].attr('ry');
    var ow=inputs[i].attr("rx")*2;
    var oh=inputs[i].attr("ry")*2;
    // get name, variable, label, nominal value, nominal dataset, random value,
    // random dataset, and systematic sources
    var name=inputs[i].data("name");
    var variable=inputs[i].data("variable");
    var label=inputs[i].data("label");
    var nominal=inputs[i].data("nominal");
    var nom_ds=inputs[i].data("nom_ds");
    var random=inputs[i].data("random");
    var rand_ds=inputs[i].data("rand_ds");
    var sys_src=inputs[i].data("sys_src");
    // push input values to output array
    exp.inp.push({'ox':ox, 'oy':oy, 'ow':ow, 'oh':oh, 'name':name,
      'variable':variable, 'label':label, 'nominal':nominal, 'nom_ds':nom_ds,
      'random':random, 'rand_ds':rand_ds, 'sys_src':sys_src});
  }
  // for each component
  for(i=0; i<cl; i++){
    // get x, y, width, and height
    var ox=components[i].attr("x");
    var oy=components[i].attr("y");
    var ow=components[i].attr("width");
    var oh=components[i].attr("height");
    // get name, variable, label, and function
    var name=components[i].data("name");
    var variable=components[i].data("variable");
    var label=components[i].data("label");
    var fun=components[i].data("fun");
    // push component values to output array
    exp.comp.push({'ox':ox, 'oy':oy, 'ow':ow, 'oh':oh, 'name':name,
      'variable':variable, 'label':label, 'fun':fun});
  }
  // for each dataset
  for(i=0; i<dsl; i++){
    // get name and values
    var name=datasets[i].name;
    var values=datasets[i].values;
    // push dataset values to output array
    exp.ds.push({name: name, values: values});
  }
  // for each source
  for(i=0; i<srcl; i++){
    // get name and value
    var name=sources[i].name;
    var value=sources[i].value;
    // push source values to output array
    exp.src.push({name: name, value: value});
  }
  // push flags to output array
  exp.flags.push(flags);
  // push each flag state in output array
  if(flags.J){exp.J.push(J);}
  if(flags.W){exp.W.push(W);}
  if(flags.Nu){exp.Nu.push(Nu);}
  if(flags.U){exp.U.push(U);}
  if(flags.UMF){exp.UMF.push(UMF);}
  if(flags.UPC){exp.UPC.push(UPC);}
  return exp;
}

// save_data saves the data to a file with the name filename
function save_data(data, filename){
  // create a tag and add to body
  var a=document.createElement("a");
  document.body.appendChild(a);
  // set a tag id and style to not display
  a.id='file_download';
  a.style="display: none";
  // turn data into a JSON string
  var json=JSON.stringify(data);
  // creat blob of data, and add to the href
  var blob=new Blob([json], {type: "octet/stream"});
  var url=window.URL.createObjectURL(blob);
  a.href=url;
  // set download to filename
  a.download=filename;
  // simulate click of a tag
  a.click();
  // remove url blob
  window.URL.revokeObjectURL(url);
  // remove the a tag
  $("#file_download").remove();
};

//****************************************************************************//
//                                                                            //
//                            Internal Functions                              //
//                                                                            //
//****************************************************************************//
// These functions perform various tasks used in the internal process of the  //
// application.                                                               //
//****************************************************************************//

// after_obj highlights the elements that are forward dependencies
function after_obj(variable){
  var i, conl=connections.length;
  // for each connection
  for(i=0; i<conl; i++){
    // if connection is for particular variable
    if(connections[i].from.data("variable")==variable){
      // highlight connection
      connections[i].to.attr({stroke:'#990000', fill:'#FFE5E5'});
      connections[i].line.attr({stroke:'#990000'});
      connections[i].arr.attr({stroke:'#990000', fill: '#990000'});
      // recursively call the function to get all forward dependencies
      after_obj(connections[i].to.data("variable"));
    }
  }
}

// before_obj highlights the elements that are backward dependencies
function before_obj(variable){
  var i, conl=connections.length;
  // for each connection
  for(i=0; i<conl; i++){
    // if connection is for particular variable
    if(connections[i].to.data("variable")==variable){
      // hightlight connection
      connections[i].from.attr({stroke:'#009900', fill:'#e5ffe5'});
      connections[i].line.attr({stroke:'#009900'});
      connections[i].arr.attr({stroke:'#009900', fill:'#009900'});
      // recursively call the function to get all backward dependencies
      before_obj(connections[i].from.data("variable"));
    }
  }
}

// browser duck types the client browser
function browser(){
  // Opera 8.0+
  let isOpera=(!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/')>=0;
  // Firefox 1.0+
  let isFirefox=typeof InstallTrigger!=='undefined';
  // Safari 3.0+ "[object HTMLElementConstructor]"
  let isSafari=/constructor/i.test(window.HTMLElement)||(function(p){return p.toString()==="[object SafariRemoteNotification]";})(!window['safari'] || (typeof safari!=='undefined' && safari.pushNotification));
  // Internet Explorer 6-11
  let isIE = /*@cc_on!@*/false || !!document.documentMode;
  // Edge 20+
  let isEdge=!isIE && !!window.StyleMedia;
  // Chrome 1+
  let isChrome=!!window.chrome && !!window.chrome.webstore;
  // Blink engine detection
  let isBlink = (isChrome || isOpera) && !!window.CSS;
  if(isOpera){
    return 'opera';
  } else if(isFirefox){
    return 'firefox';
  } else if(isSafari){
    return 'safari';
  } else if(isIE){
    return 'ie';
  } else if(isEdge){
    return 'edge';
  } else if(isChrome){
    return 'chrome';
  } else {
    return 'other';
  }
}

// reset_obj_color resets all objects to default color
function reset_obj_color(){
  var i, il=inputs.length, cl=components.length, conl=connections.length;
  // for each input, set color to default
  for(i=0; i<il; i++){inputs[i].attr({stroke:'#000000', fill:'#FFFFFF'});}
  // for each component, set color to default
  for(i=0; i<cl; i++){components[i].attr({stroke:'#000000', fill:'#FFFFFF'});}
  // for each connection, set color to default
  for(i=0; i<conl; i++){
    connections[i].line.attr({stroke:'#000000'});
    connections[i].arr.attr({stroke:'#000000', fill:'#000000'});
  }
}

// dataToArray grabs all prop of obj and outs array of prop
function dataToArray(obj, prop){
  var i, arr=[], ol=obj.length;
  // for each obj
  for(i=0; i<ol; i++){
    // grab prop
    arr.push(obj[i].data(prop));
  }
  // output array of prop
  return arr;
}

// get_dep parses expr to get all dependent variables
function get_dep(expr){
  // constants that the function should ignore
  var constants=['e','E','i','Infinity','LN2','LN10','LOG2E','LOG10E','phi',
                 'pi','PI','SQRT1_2','SQRT2','tau','version'];
  var node=math.parse(expr), dep_var=[];
  // filter the math.parse node to get dependent variables
  node.filter(function(node){
    if(node.isSymbolNode && $.inArray(node.name,constants)==-1){
      dep_var.push(node.name);
    }
  });
  // return only unique variables, not duplicates
  return $.unique(dep_var);
}

// get_inp_var returns all input variables in the system
function get_inp_var(){
  var i, il=inputs.length, inp_var=[];
  // if there are inputs
  if(il!=0){
    // for each input, get variables
    for(i=0; i<il; i++){inp_var.push(inputs[i].data("variable"));}
    // return the variables
    return inp_var;
  // if there are no inputs, return false
  } else {
    return false;
  }
}

// get_comp_var returns all component variables in the system
function get_comp_var(){
  var i, cl=components.length, comp_var=[];
  // if there are components
  if(cl!=0){
    // for each component, get variable
    for(i=0; i<cl; i++){comp_var.push(components[i].data("variable"));}
    // return the variables
    return comp_var;
  // if there are no components, return false
  } else {
    return false;
  }
}

// replace_var_expr replaces a variable in an expression, used when editing an
// input or component variable
function replace_var_expr(var_from, var_to, expr){
  // constants that should be ignored
  var constants=['e','E','i','Infinity','LN2','LN10','LOG2E','LOG10E','phi',
                 'pi','PI','SQRT1_2','SQRT2','tau','version'];
  var node=math.parse(expr), dep_var=[];
  // filter the math.parse node to replace var_from to var_to
  node.filter(function(n){
    if(n.isSymbolNode && $.inArray(n.name,constants)==-1){
      if(n.name==var_from){
        n.name=var_to;
      }
    }
  });
  // return the expression with new variable
  return node.toString().replace(/\s/g, '');
}

// valid_variable checks if variable is not already used
function valid_variable(inputs, components, variable){
  var i, il=inputs.length, cl=components.length, conl;
  // constants that not should be used
  var constants=['e','E','i','Infinity','LN2','LN10','LOG2E','LOG10E','phi',
                 'pi','PI','SQRT1_2','SQRT2','tau','version'];
  conl=constants.length;
  // for each input, check if variable has been used
  for(i=0; i<il; i++){
    if(inputs[i].data("variable")==variable){return false;}
  }
  // for each component, check if variable has been used
  for(i=0; i<cl; i++){
    if(components[i].data("variable")==variable){return false;}
  }
  // for each constant, check if variable is the same
  for(i=0; i<conl; i++){
    if(constants[i]==variable){return false;}
  }
  return true;
}

// varID returns the id of variable in array
function varID(array, variable){
  var i, al=array.length;
  // for each element in array
  for(i=0; i<al; i++){
    // if variable matches element of array, return index
    if(array[i].data("variable")==variable){return i;}
  }
  return false;
}

// wheel performs the zoom feature of the application
function wheel(e){
  var delta=0;
  // determine what browser is being used
  if(!e){e=window.event;}
  if(e.wheelDelta){
    delta=e.wheelDelta/120;
  } else if(e.detail){
    delta=-e.detail/3;
  }
  if(delta){
    // get the x and y
    x=Number(viewbox[0])+Number((e.clientX-$("#holder").offset().left)/zoom);
    y=Number(viewbox[1])+Number((e.clientY-$("#holder").offset().top)/zoom);
    // if the scroll is up or down, set delta to out or in zoom
    if(delta<0){
      delta=0.95;
    } else {
      delta=1.05;
    }
    // calculate zoom
    zoom=((zoom||1)*delta)||1;
    if(zoom>10){
      zoom=10;
    } else if(zoom<0.1){
      zoom=0.1;
    }
    // change viewbox to reflect zoom calculated
    viewbox[0]=x-(e.clientX-$("#holder").offset().left)/zoom;
    viewbox[1]=y-(e.clientY-$("#holder").offset().top)/zoom;
    viewbox[2]=$("#holder").width()/zoom;
    viewbox[3]=$("#holder").height()/zoom;
    r.setViewBox.apply(r, viewbox);
  }
  // prevent the default action of scroll
  if(e.preventDefault){e.preventDefault();}
  e.returnValue=false;
}
