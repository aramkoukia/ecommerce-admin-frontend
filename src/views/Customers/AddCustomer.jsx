import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import SchemaForm from "jsonschema-form-for-material-ui";
const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

// const styles = theme => ({
//   field: {},
//   formButtons: {},
//   root: {},
// });

const schema = {
  // "title": "A registration form",
  // "description": "A simple form example.",
  type: "object",
  required: [
    "firstName",
    "lastName",
    "companyName",
    "phoneNumber",
    "mobile",
    "country",
    "address",
    "city",
    "postalCode",
    "userName",
    "email"
  ],
  properties: {
    firstName: {
      type: "string",
      title: "First Name"
    },
    lastName: {
      type: "string",
      title: "Last Name"
    },
    companyName: {
      type: "string",
      title: "Company Name"
    },
    phoneNumber: {
      type: "string",
      title: "Phone Number"
    },
    mobile: {
      type: "string",
      title: "Mobile"
    },
    country: {
      type: "string",
      title: "Country",
      enum: ["Canada", "United States"]
    },
    address: {
      type: "string",
      title: "Address"
    },
    city: {
      type: "string",
      title: "City"
    },
    province: {
      type: "string",
      title: "Province",
      enum: ["British Columbia", "Alberta", "Ontario"]
    },
    postalCode: {
      type: "string",
      title: "Postal Code"
    },
    pstNumber: {
      type: "string",
      title: "PST Number"
    },
    creditLimit: {
      type: "number",
      title: "Credit Limit"
    },
    userName: {
      type: "string",
      title: "User Name"
    },
    email: {
      type: "string",
      title: "Email"
    },
    website: {
      type: "string",
      title: "Website"
    }
  }
};

const uiSchema = {
  // "ui:orientation": "row",
  firstName: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  lastName: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  companyName: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  phoneNumber: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  mobile: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  country: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  address: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  city: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  province: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  postalCode: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  pstNumber: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  creditLimit: {
    "ui:autofocus": true,
    "ui:emptyValue": 0
  },
  userName: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  email: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  website: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  }
};

const initialFormData = {
  firstName: "",
  lastName: "",
  companyName: "",
  phoneNumber: "",
  mobile: "",
  country: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  pstNumber: "",
  creditLimit: 0,
  userName: "",
  email: "",
  website: ""
};

function AddCustomer(props) {
  return (
    <SchemaForm
      //classes={classes}
      schema={schema}
      uiSchema={uiSchema}
      formData={initialFormData}
      //onCancel={this.onCancel}
      //onSubmit={this.onSubmit}
      //onChange={this.onFormChanged}
    />
  );
}

export default withStyles(styles)(AddCustomer);
