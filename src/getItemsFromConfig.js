function processFormMultiColumn(item) {
  if (item.component !== 'FormMultiColumn') {
    return item;
  }

  return item.items.flat().map(innerItem => {
    if (innerItem.component === 'FormMultiColumn') {
      return processFormMultiColumn(innerItem);
    }

    return innerItem;
  }).flat();
}

export default function getItemsFromConfig(config) {
  return config
    .flatMap(page => page.items)
    .flatMap(item => processFormMultiColumn(item));
}
