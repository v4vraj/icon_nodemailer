import { confirmMsg } from "./message.js";

const registrationConfirm = ({ name, event, link }) => {
  const data = confirmMsg(name, event, link);
  // Potential action on data, like sending or logging
  return data;
};

export { registrationConfirm };
