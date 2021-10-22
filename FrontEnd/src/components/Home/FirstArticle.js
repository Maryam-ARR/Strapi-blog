import React from "react";
import { Link } from "react-router-dom";

class FirstArticle extends React.Component {
  render() {
    return (
      <div className='first-article '>
        <div className='container-article'>
          <div className='row-article'>
            <div className='col-article'>
              <div className='small-article'>
                <div className='text-article'>
                  {this.props.firstArticle?.soustitle}
                </div>
              </div>
              <h2>{this.props.firstArticle?.title}</h2>
            </div>
            <div className='col-article2 '>
              <p></p>
              <p>{this.props.firstArticle?.description}</p>
              <p></p>
              {this.props.firstArticle?.id ? (
                <Link to={"/articlemore/" + this.props.firstArticle?.id}>
                  <button>Lire la suite</button>
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FirstArticle;
