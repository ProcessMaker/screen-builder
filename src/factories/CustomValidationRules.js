import Validator from "@chantouchsek/validatorjs";
import moment from "moment-timezone";

Validator.register(
  "custom-same",
  function (val, req) {
    let val1;
    const val2 = val;
    if (!req.includes(".")) {
      val1 = this.validator._flattenObject(this.validator.input)[req];
    } else {
      val1 = req.split(".").reduce((obj, i) => obj[i], this.validator.input);
    }

    if (val1 === val2) {
      return true;
    }

    return false;
  },
  "The :attribute and :custom-same fields must match."
);

Validator.register(
  "after",
  function (date, params) {
    // checks if incoming 'params' is a date or a key reference.
    const inputDate = moment(date).toISOString();
    const afterDate = moment(params).toISOString();

    return inputDate > afterDate;
  },
  "The :attribute must be after :after."
);

Validator.register(
  "after_or_equal",
  function (date, params) {
    // checks if incoming 'params' is a date or a key reference.
    const inputDate = moment(date).toISOString();
    const equalOrAfterDate = moment(params).toISOString();

    return inputDate >= equalOrAfterDate;
  },
  "The :attribute must be equal or after :after_or_equal."
);

Validator.register(
  "before",
  function (date, params) {
    // checks if incoming 'params' is a date or a key reference.
    const inputDate = moment(date).toISOString();
    const beforeDate = moment(params).toISOString();

    return inputDate < beforeDate;
  },
  "The :attribute must be before :before."
);

Validator.register(
  "before_or_equal",
  function (date, params) {
    // checks if incoming 'params' is a date or a key reference.
    const inputDate = moment(date).toISOString();
    const beforeDate = moment(params).toISOString();

    return inputDate <= beforeDate;
  },
  "The :attribute must be equal or before :before_or_equal."
);

Validator.register(
  "custom_date",
  function (date) {
    let format = "MM/DD/YYYY";
    if (
      typeof window.ProcessMaker !== "undefined" &&
      window.ProcessMaker.user &&
      window.ProcessMaker.user.datetime_format
    ) {
      format = window.ProcessMaker.user.datetime_format.replace(
        /[\sHh:msaAzZ]/g,
        ""
      );
    }

    const checkDate = moment(date, [format, moment.ISO_8601], true);
    return checkDate.isValid();
  },
  "The :attribute must be a valid date."
);
