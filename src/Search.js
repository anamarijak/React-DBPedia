import React from 'react';
import './App.css';

//make all words first letter capital 
function titleCase(str) {
  var splitStr = str.toLowerCase().split('_');
  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      infobox: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.RenderDiv = this.RenderDiv.bind(this);
  }


//handling change at input field
  handleChange(event) {
    this.setState({value: titleCase(event.target.value).split(' ').join('_')});
  }

  //handling submit data
  async handleSubmit(event) {
    event.preventDefault();
    const url =`http://dbpedia.org/data/${this.state.value}.json`;
    const response = await fetch(url);
    const data = await response.json();
    this.setState({infobox: data}); 
  }


  //main function for app logic 
  //rendering data from api
  RenderDiv() {
    //console.log(this.state);
    if(this.state.value === '' || this.state.infobox.length === 0) { //if there is nothing to display return empty div
      return (
        <div className="emptyDiv"></div>
      )
    } 
    else {
      if(this.state.infobox !== undefined) { //if there is an array of objects do:
        const u = this.state.infobox[`http://dbpedia.org/resource/${this.state.value}`];
        if(u !== undefined) { //if there is an instance of object do: 
          return (
            <div className="thumbParagraph">
              { u['http://dbpedia.org/ontology/thumbnail'] !== undefined ? //if there is thumb display it; else display message
                <img src={u['http://dbpedia.org/ontology/thumbnail'][0].value} alt="Thumbnail pic"  className="img-thumbnail"/> : 
                <div className="alert alert-secondary" role="alert">There is no thumb for this result!</div>
              }
              { u["http://dbpedia.org/ontology/abstract"] !== undefined ? //if there is english abstract display it, else display message
                u["http://dbpedia.org/ontology/abstract"].map(link => ( 
                <div key={link.lang} className="paragraphDiv">
                  {link.lang === "en" ? <p className="paragraph">{link.value}</p> : <p></p>}
                </div>
                )
              ) : <div className="alert alert-secondary" role="alert">There is no english abstract for your search input.</div>}
            </div>
          )
        } 
        else {
          return(<div className="alert alert-secondary" role="alert">No results</div>)
        }
      } 
      else {
        return(<div className="alert alert-secondary" role="alert">No results</div>);
      }
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="input-group mb-3">
          <input type="text" value={this.state.value} onChange={this.handleChange} className="form-control"/>
          <div className="input-group-append">
            <input type="submit" value="Search" className="btn btn-outline-dark"/>
          </div>
        </form>
        {this.RenderDiv()}
      </div>
    );
  }
}

export default Search;