var data = localStorage.getItem("config");
var options_data = JSON.parse(data);
var records = options_data.records;

for (var i = 0; i < options_data.records.length; i++) {
    console.log(options_data.records[i].nom);
    console.log(options_data.records[i].score);
}

var recordsContainer = document.getElementById("recordsId");
      var html = "";

      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        html += "<p>" + record.nom + ": " + record.score + "</p>";
      }

      recordsContainer.innerHTML = html;