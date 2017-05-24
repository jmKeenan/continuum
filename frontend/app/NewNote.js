import React, { Component } from 'react'
import API from './helpers/API'

class NewNote extends Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }
  static get contextTypes() {
    return { notify: React.PropTypes.func.isRequired }
  }

  componentWillMount() {
    this.setState({
      name: '',
      note: '',
      action: '',
    })
  }

  onSubmit(ev) {
    ev.preventDefault()
    API.newNote(this.state, note => {
      this.context.notify({
        message: `Note created`,
        level: 'success',
        autoDismiss: 1,
        onRemove: () => {
          this.props.router.push(`/${note.id}`)
        }
      })
    })
  }

  onInputChange(key, ev) {
    var update = {}
    update[key] = ev.target.value
    this.setState(update)
  }

  render() {
    return <div className="main-wrapper">
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <label>Name</label>
          <input
            type="text"
            value={this.state.name}
            onChange={this.onInputChange.bind(this, 'name')} />
        </fieldset>
        <fieldset>
          <label>Note</label>
          <textarea
            value={this.state.note}
            onChange={this.onInputChange.bind(this, 'note')}
          />
        </fieldset>
        <fieldset>
          <label>Action</label>
          <input
            type="text"
            value={this.state.action}
            onChange={this.onInputChange.bind(this, 'action')} />
        </fieldset>
        <input type="submit" value="Save" />
      </form>
    </div>
  }
}

export {
  NewNote
}
