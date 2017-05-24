import React from 'react'
import { testImg, testImg2 } from './styles.css'

export default class TestObject extends React.Component {
  static get propTypes () {
    return {
      currentUser: React.PropTypes.object,
      params: React.PropTypes.shape({
        testObjectId: React.PropTypes.Integer,
      }),
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      testObject: null,
    }
  }

  componentDidMount () {
    this.props.API.getTestObject({'id': this.props.params.testObjectId})
      .then(testObject => this.setState({testObject: testObject}))
      .catch(error => {
        console.error(`++ error fetching testObject: ${error.message}`)
      })
  }

  render () {
    return (
      <div>
        <div>
          {'Test Object'}
        </div>
        <div className={testImg}></div>
        <div className={testImg2}>
          <img src="/public/blue.png"/>
        </div>
        <div>
          {this.state.testObject
            ? this.state.testObject.key + ': ' + this.state.testObject.value
            : 'no test object'}
        </div>
      </div>
    )
  }
}
