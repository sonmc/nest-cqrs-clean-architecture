export function presentList(items: any) {
  return items.map((item: any) => {
    return presentItem(item);
  });
}

export function presentItem(item: any) {
  return {
    ...item,
    title: item.module + ' ' + item.action || item.method, // can use i18n here
  };
}
