function normalizeDataPoint(value) {
  return value || 0
}

export function getChartDatasets(tabularData, { transform, datasetTransform, includeTotal }) {
  function dataPointCallback(value, i, data) {
    let result = value
    if (transform) {
      result = transform(result, i, data)
    }
    return normalizeDataPoint(result)
  }
  if (!tabularData.rows.length) {
    return [
      {
        data: tabularData.colTotals.map(dataPointCallback),
        colKeys: tabularData.colKeys,
      },
    ]
  }

  if (!tabularData.colKeys.length) {
    return [
      {
        data: tabularData.rowTotals.map(dataPointCallback),
        colKeys: tabularData.rowKeys,
      },
    ]
  }

  // bidimensional chart
  const result = tabularData.rows.map((rowValues, i) => ({
    label: tabularData.rowNames[i],
    data: rowValues.map(dataPointCallback),
    colKeys: tabularData.colKeys,
    datalabels: {},
  }))

  if (includeTotal) {
    result.push({
      label: 'Total',
      data: tabularData.colTotals.map(dataPointCallback),
      colKeys: tabularData.colKeys,
      datalabels: {},
    })
  }

  if (datasetTransform) {
    return result.map(datasetTransform)
  }

  return result
}
