export function isDeviceOnline(device) {
  return device.last_athena_ping > (device.fetched_at - 120);
}

export function deviceTitle(device) {
  if (device.alias && device.alias.length > 0) {
    return device.alias;
  } else {
    return `${ deviceTypePretty(device) } ${ device.dongle_id }`;
  }
}

export function deviceTypePretty(device) {
  if (device.device_type == 'neo') {
    return 'EON';
  } else {
    return 'comma two';
  }
}
