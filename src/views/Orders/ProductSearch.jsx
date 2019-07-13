import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import ProductService from '../../services/ProductService';

function renderInputComponent(inputProps) {
  const {
    classes, inputRef = () => {}, ref, ...other
  } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: (node) => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(`${suggestion.productCode} - ${suggestion.productName} - (Price: $${suggestion.salesPrice}) - (Van: ${suggestion.vancouverBalance} - Abb: ${suggestion.abbotsfordBalance} - Total: ${suggestion.vancouverBalance + suggestion.abbotsfordBalance} - OnHold: ${suggestion.onHoldAmount})`, query);
  const parts = parse(`${suggestion.productCode} - ${suggestion.productName} - (Price: $${suggestion.salesPrice}) - (Van: ${suggestion.vancouverBalance} - Abb: ${suggestion.abbotsfordBalance} - Total: ${suggestion.vancouverBalance + suggestion.abbotsfordBalance} - OnHold: ${suggestion.onHoldAmount})`, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => (part.highlight ? (
          <span key={String(index)} style={{ fontWeight: 500 }}>
            {part.text}
          </span>
        ) : (
          <strong key={String(index)} style={{ fontWeight: 300 }}>
            {part.text}
          </strong>
        )))}
      </div>
    </MenuItem>
  );
}

const styles = theme => ({
  root: {
    height: 80,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    height: 400,
    'overflow-y': 'scroll',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

class ProductSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      filteredSuggestions: [],
    };

    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(
      this,
    );
    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(
      this,
    );

    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);

    this.getSuggestionValue = this.getSuggestionValue.bind(this);
  }

  async componentDidMount() {
    const suggestions = await ProductService.getProductsForSales();
    this.setState({ suggestions });
  }

  onKeyPress(e) {
    const { filteredSuggestions, value } = this.state;
    if (e.key === 'Enter' && filteredSuggestions) {
      if (filteredSuggestions.length === 1) {
        this.getSuggestionValue(filteredSuggestions[0]);
        this.setState({
          value: '',
        });
      } else if (filteredSuggestions.length > 1) {
        this.getSuggestions(value);
      }
    }
  }

  onChange(event, { newValue, method }) {
    this.setState({
      value: (method === 'click' || method === 'enter') ? '' : newValue,
    });
  }

  getSuggestionValue = (suggestion) => {
    const { productChanged } = this.props;
    productChanged(suggestion);
    return suggestion.productName;
  }

  getSuggestions(value) {
    const { suggestions } = this.state;
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : suggestions.filter((suggestion) => {
        const keep = count < 40
            && (suggestion.productName.toLowerCase().includes(inputValue)
              || suggestion.productCode.toLowerCase().includes(inputValue));

        if (keep) {
          count += 1;
        }

        return keep;
      });
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      filteredSuggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      filteredSuggestions: [],
    });
  };

  render() {
    const { classes } = this.props;
    const { filteredSuggestions, value } = this.state;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: filteredSuggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion,
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            label: '',
            placeholder: 'Search Products',
            value,
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            inputRef: (node) => {
              this.popperNode = node;
            },
            InputLabelProps: {
              shrink: true,
            },
          }}
          theme={{
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Popper anchorEl={this.popperNode} open={Boolean(options.children)}>
              <Paper
                square
                {...options.containerProps}
                style={{
                  width: this.popperNode ? this.popperNode.clientWidth : null,
                }}
              >
                {options.children}
              </Paper>
            </Popper>
          )}
        />
      </div>
    );
  }
}

ProductSearch.propTypes = {
  classes: PropTypes.object.isRequired,
  productChanged: PropTypes.func,
};

export default withStyles(styles)(ProductSearch);
