
// pulls the articles
// $.getJSON("/articles", data=> {
//     for (var i = 0; i < data.length; i++) {
//       $("#articleList").append("<li data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</li>");
//     }
//   });
  $.ajax({
    method: "GET",
    url: "/articles"
  })
   .then(data=> {
    for (var i = 0; i < data.length; i++) {
      $("#articleList").append("<li data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</li>");
    }
  });


  $(document).on("click", "li", ()=> {
    $("#notes").empty();
    var article_Id = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + article_Id
    })
     .then(data=> {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='noteTitle' name='title' >");
        $("#notes").append("<textarea id='noteText' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='saveNote'>Save this article!</button>");
  
        if (data.note) {
          $("#noteTitle").val(data.note.title);
          $("#noteText").val(data.note.body);
        }
      });
  });  
  
  $(document).on("click", "#saveNote", ()=> {

    var article_Id = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + article_Id,
      data: {
        title: $("#noteTitle").val(),
        body: $("#noteText").val()
      }
    }).then(data=>{
        console.log(data);
        $("#notes").empty();
      });
  $("#noteTitle").val(""); 
  $("#noteText").val("");
  });