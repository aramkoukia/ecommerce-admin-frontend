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
  "type": "object",
  "required": [
    "name",
  ],
  "properties": {
    "name": {
      "type": "string",
      "title": "Location Name"
    },
    "address": {
      "type": "string",
      "title": "Address"
    },
  }
}

const uiSchema = {
  "Name": {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  "Address": {
    "ui:widget": "updown",
    "ui:title": "Age of person",
    "ui:description": "This description will be in a Popover"
  }
}

const initialFormData = {
  "name": "",
  "address": "",
}

function AddLocation(props) {
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

export default withStyles(styles)(AddLocation);
