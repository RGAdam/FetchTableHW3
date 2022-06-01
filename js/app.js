const loader = document.querySelector(".loading");
table = document.querySelector(".people-table");
tr = table.getElementsByTagName("tr");

async function fetchPeople(url) {
  loader.classList.remove("display");

  const res = await fetch(url);

  return await res.json();
}

function addToDom(data) {
  loader.classList.add("display");
  let output = "";

  data.forEach((person) => {
    let image = person.image.split("?")[0];

    output += `<tr>
                <td class="flex-box"><p>${person.full_name}</p> <img src="${image}" alt="x" loading="lazy"></td>
                <td>${person.location}, ${person.country}</td>
                <td>${person.email}</td>
                <td>${person.phone_number}</td>
               </tr>`;
  });
  document.querySelector(".people-table").innerHTML = `<tr>
                  <th onclick="sortTable(0)">Name</th>
                  <th onclick="sortTable(1)">Location</th>
                  <th onclick="sortTable(2)">Email</th>
                  <th onclick="sortTable(3)">Phone number</th>
                 </tr>
                 ${output}`;
}

function sortTable(n) {
  let table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchCount = 0;

  table = document.querySelector(".people-table");

  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */

  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir === "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir === "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchCount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchCount === 0 && dir === "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function getRadioButtonValue() {
  let selectedButton, radioButtons;
  radioButtons = document.querySelectorAll('input[name="search-for"]');

  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedButton = radioButton.value;
      return selectedButton;
    }
  }
}

function filterFor() {
  let input, filter, td, i, txtValue, searchValue;
  input = document.querySelector(".search-bar");
  filter = input.value.toUpperCase();

  if (getRadioButtonValue() === "Name") {
    searchValue = 0;
  } else {
    searchValue = 1;
  }

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[searchValue];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  didFilterFoundRecords();
}

function didFilterFoundRecords() {
  let displayed = 0,
    noRecordsP;

  noRecordsP = document.querySelector(".no-records");

  for (let i = 0; i < tr.length; i++) {
    if (!(tr[i].style.display === "none")) {
      displayed++;
    }
  }

  if (displayed === 1) {
    noRecordsP.classList.remove("display");
  } else {
    noRecordsP.classList.add("display");
  }
}

fetchPeople(
  "https://api.mockaroo.com/api/c4170dc0?count=100&key=93e4fe30"
).then((res) => addToDom(res));
