let clear_data = []
const tbldata = document.querySelector('.table')
const fileInput = document.getElementById('fileInput')

function handleFileInputChange(event) {
  const file = event.target.files[0]
  const reader = new FileReader()

  reader.onload = e => {
    const htmlContent = e.target.result

    // Parse the HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    // const body = doc.body

    const scriptTag = doc.body.querySelectorAll('script')
    const sdata = scriptTag[2]
    const esdata = sdata.textContent

    eval(esdata)

    clearData(datagrid18.rows)

    renderTable()
  }

  reader.readAsText(file)
}

function renderTable() {
  tbldata.innerHTML = ''
  tbldata.appendChild(makeTable(vtotals(clear_data)))
}

fileInput.addEventListener('change', handleFileInputChange)

function clearData(rows) {
  // const final_data = []
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
      clear_data.push(lin)
      // console.log(lin)
    }
  }
}

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
  cleanded_data = final_data
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
  return array_of_keys
}

function rnd(val) {
  return Math.round(val * 100) / 100
}

function trimino(isodate) {
  const ymd = isodate.split('-')
  if (ymd[1] === '01') {
    return `${ymd[0]}-A`
  }
  if (ymd[1] === '02') {
    return `${ymd[0]}-A`
  }
  if (ymd[1] === '03') {
    return `${ymd[0]}-A`
  }
  if (ymd[1] === '04') {
    return `${ymd[0]}-B`
  }
  if (ymd[1] === '05') {
    return `${ymd[0]}-B`
  }
  if (ymd[1] === '06') {
    return `${ymd[0]}-B`
  }
  if (ymd[1] === '07') {
    return `${ymd[0]}-C`
  }
  if (ymd[1] === '08') {
    return `${ymd[0]}-C`
  }
  if (ymd[1] === '09') {
    return `${ymd[0]}-C`
  }
  if (ymd[1] === '10') {
    return `${ymd[0]}-D`
  }
  if (ymd[1] === '11') {
    return `${ymd[0]}-D`
  }
  if (ymd[1] === '12') {
    return `${ymd[0]}-D`
  }
}

function etisio(isodate) {
  return isodate.substring(0, 4)
}

function minas(isodate) {
  return isodate.substring(0, 7)
}

function mera(isodate) {
  return isodate
}

let groupfn = trimino

function etisios() {
  groupfn = etisio
  renderTable()
}

function triminos() {
  groupfn = trimino
  renderTable()
}

function minass() {
  groupfn = minas
  renderTable()
}

function meras() {
  groupfn = mera
  renderTable()
}

function vtotals(data) {
  var aggreg = data.reduce((result, line) => {
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
      tsajia: 0,
      tsfpa: 0,
      ttotal: 0,
    }

    const t1ajia = rnd(curr.t1ajia + line.v1ajia)
    const t1fpa = rnd(curr.t1fpa + line.v1fpa)
    const t2ajia = rnd(curr.t2ajia + line.v2ajia)
    const t2fpa = rnd(curr.t2fpa + line.v2fpa)
    const t3ajia = rnd(curr.t3ajia + line.v3ajia)
    const t3fpa = rnd(curr.t3fpa + line.v3fpa)
    const t4ajia = rnd(curr.t4ajia + line.v4ajia)
    const t4fpa = rnd(curr.t4fpa + line.v4fpa)
    const t5ajia = rnd(curr.t5ajia + line.v5ajia)
    const tsajia = rnd(t1ajia + t2ajia + t3ajia + t4ajia + t5ajia)
    const tsfpa = rnd(t1fpa + t2fpa + t3fpa + t4fpa)
    const ttotal = rnd(tsajia + tsfpa)

    result[key] = {
      dat: curr.dat,
      t1ajia,
      t1fpa,
      t2ajia,
      t2fpa,
      t3ajia,
      t3fpa,
      t4ajia,
      t4fpa,
      t5ajia,
      tsajia,
      tsfpa,
      ttotal,
    }

    return result
  }, {})

  var arr_totals = []
  for (const key in aggreg) {
    arr_totals.push(aggreg[key])
  }
  return arr_totals
}
