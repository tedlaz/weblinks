let grows = []
function handleFileInputChange(event) {
  const file = event.target.files[0]
  const reader = new FileReader()

  reader.onload = function (e) {
    const htmlContent = e.target.result

    // Parse the HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    // const body = doc.body

    const scriptTag = doc.body.querySelectorAll('script')
    const sdata = scriptTag[2]
    const esdata = sdata.textContent

    eval(esdata)

    grows = datagrid18.rows
    // grows = rows
    // const final_data = makeCleanRows(rows)
    // document.querySelector('.table').appendChild(makeTable(final_data))
    render1()
  }

  reader.readAsText(file)
}

function render1() {
  const final_data = makeCleanRows(grows)
  document.querySelector('.table').innerHTML = ''
  document.querySelector('.table').appendChild(makeTable(final_data))
}

// Add event listener to file input change event
const fileInput = document.getElementById('fileInput')
fileInput.addEventListener('change', handleFileInputChange)

function makeCleanRows(rows) {
  const final_data = []
  for (row of rows) {
    const zita = row.data[0].trim()
    if (zita !== '') {
      lin = {
        arz: zita,
        // dat: new Date(row.data[1]),
        dat: row.data[1],
        // par: row.data[2],
        v1ajia: parseFloat(row.data[7]),
        v1fpa: parseFloat(row.data[3]),
        v2ajia: parseFloat(row.data[8]),
        v2fpa: parseFloat(row.data[4]),
        v3ajia: parseFloat(row.data[9]),
        v3fpa: parseFloat(row.data[5]),
        v4ajia: parseFloat(row.data[10]),
        v4fpa: parseFloat(row.data[6]),
        v5ajia: parseFloat(row.data[11]),
      }
      final_data.push(lin)
      // console.log(lin)
    }
  }
  return vtotals(final_data)
}

// return html table element from array of objects
function makeTable(json_objects_arr) {
  var table = document.createElement('table')
  var keys = getKeysFromArray(json_objects_arr)
  table.appendChild(makeTHEAD(keys))
  table.appendChild(makeTBODY(json_objects_arr, keys))
  return table
}

// make header row from array of keys
function makeTHEAD(keys) {
  var thead = document.createElement('thead')
  var tr = document.createElement('tr')
  keys.forEach(function (key) {
    var th = document.createElement('th')
    th.textContent = key
    tr.appendChild(th)
  })
  thead.appendChild(tr)
  return thead
}

// make rows from key values in json
function makeTBODY(json, keys) {
  var tbody = document.createElement('tbody')
  json.forEach(function (object) {
    let tr = document.createElement('tr')
    keys.forEach(function (key) {
      var td = document.createElement('td')
      td.textContent = object[key].toLocaleString('el-GR', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  return tbody
}

// return alphabetized array of keys from all objects in an array
function getKeysFromArray(json_objects_arr) {
  var array_of_keys = []
  json_objects_arr.forEach(function (obj) {
    Object.keys(obj).forEach(function (key) {
      if (!array_of_keys.includes(key)) {
        array_of_keys.push(key)
      }
    })
  })
  return array_of_keys.sort()
}

function rnd(val) {
  return Math.round(val * 100) / 100
}

function trimino(isodate) {
  const ymd = isodate.split('-')
  if (ymd[1] === '01') {
    return `${ymd[0]}A`
  }
  if (ymd[1] === '02') {
    return `${ymd[0]}A`
  }
  if (ymd[1] === '03') {
    return `${ymd[0]}A`
  }
  if (ymd[1] === '04') {
    return `${ymd[0]}B`
  }
  if (ymd[1] === '05') {
    return `${ymd[0]}B`
  }
  if (ymd[1] === '06') {
    return `${ymd[0]}B`
  }
  if (ymd[1] === '07') {
    return `${ymd[0]}C`
  }
  if (ymd[1] === '08') {
    return `${ymd[0]}C`
  }
  if (ymd[1] === '09') {
    return `${ymd[0]}C`
  }
  if (ymd[1] === '10') {
    return `${ymd[0]}D`
  }
  if (ymd[1] === '11') {
    return `${ymd[0]}D`
  }
  if (ymd[1] === '12') {
    return `${ymd[0]}D`
  }
}
function etisio(isodate) {
  return isodate.substring(0, 4)
}
function minas(isodate) {
  return isodate.substring(0, 7)
}
let groupfn = trimino

function etisios() {
  groupfn = etisio
  console.log('etisios')
  render1()
}

function triminos() {
  groupfn = trimino
  console.log('triminos')
  // document.querySelector('.table').innerHTML = ''
  // console.log(final_data)
  render1()
}

function minass() {
  groupfn = minas
  console.log('miniaios')
  render1()
}

function vtotals(data) {
  var aggreg = data.reduce(function (result, line) {
    var key = groupfn(line.dat)

    var curr = result[key] || {
      dat: key,
      t1ajia: 0,
      t1fpa: 0,
      t2ajia: 0,
      t2fpa: 0,
      t3ajia: 0,
      t3fpa: 0,
      t4ajia: 0,
      t4fpa: 0,
      t5ajia: 0,
    }

    // console.log(curr)

    result[key] = {
      dat: curr.dat,
      t1ajia: rnd(curr.t1ajia + line.v1ajia),
      t1fpa: rnd(curr.t1fpa + line.v1fpa),
      t2ajia: rnd(curr.t2ajia + line.v2ajia),
      t2fpa: rnd(curr.t2fpa + line.v2fpa),
      t3ajia: rnd(curr.t3ajia + line.v3ajia),
      t3fpa: rnd(curr.t3fpa + line.v3fpa),
      t4ajia: rnd(curr.t4ajia + line.v4ajia),
      t4fpa: rnd(curr.t4fpa + line.v4fpa),
      t5ajia: rnd(curr.t5ajia + line.v5ajia),
    }

    return result
  }, {})

  var arr_totals = []
  for (const key in aggreg) {
    arr_totals.push(aggreg[key])
  }
  return arr_totals
}
