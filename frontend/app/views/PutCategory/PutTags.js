import React, {PropTypes} from 'react'
import Delete from 'components/Delete/Delete'
import s from './styles.css'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc'

const SortableItem = SortableElement((props) => {
  // Wraps sortable items - required for reorder
  return (
    <MakeEditableItem {...props}/>
  )
})

const DragHandle = SortableHandle(() => <div className={s.grabber}/>)

class MakeEditableItem extends React.Component {
  static propTypes = {
    tag: PropTypes.object.isRequired,
    tagEditingIndex: PropTypes.number,
    handleUpdateTag: PropTypes.func.isRequired,
    handleEditingTag: PropTypes.func.isRequired,
    handleremoveTag: PropTypes.func.isRequired,
  }
  constructor (props) {
    super(props)
    this.state = {
      tagName: this.props.tag.tagValue,
      editable: false,
      deleted: false,
      tagEditingIndex: null,
      tryDelete: false,
    }
    this.focus = this.focus.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      tagName: nextProps.tag.tagValue,
      editable: nextProps.tagEditingIndex === nextProps.tag.tagIndex, // Checks if another tag is being edited
    })
  }
  focus = () => {
    this.textInput.focus()
  }
  handleEdit = () => {
    this.setState({editable: !this.state.editable})
    this.props.handleEditingTag(this.props.tag.tagIndex)
  }
  handleSetTag = () => {
    this.props.handleEditingTag(null)
    this.setState({editable: !this.state.editable})
    this.props.handleUpdateTag(this.state.tagName, this.props.tag.tagIndex, this.props.tag.tagId) // Updates tagValue in PutCategory
  }
  handleSetTagOnEnter = (event) => {
    event.key === 'Enter' ? this.handleSetTag() : null
  }
  handleTryDelete = () => {
    this.setState({tryDelete: !this.state.tryDelete})
  }
  handleremoveTag = () => {
    if (this.state.editable === false) {
      this.setState({deleted: true})
      this.props.handleremoveTag(this.props.tag.tagId, this.props.tag.tagIndex, this.state.tagName) // Removes Tag by tagId
    }
  }
  handleClick = (event) => {
    this.setState({tagName: this.props.tag.tagValue})
  }
  handleChange = (event) => {
    this.setState({tagName: event.target.value})
  }
  render () {
    return (
      <li className={s.tagItem}>
        {!this.state.deleted ? <Delete
          tryDelete={this.state.tryDelete}
          nameOfItem={this.state.tagName}
          deleteType={'tag'}
          handleDeleteFunction={this.handleremoveTag}
          handleTryDelete={this.handleTryDelete}
          itemId={null}
          deleteMessage={'TAKE CAUTION!'}/> : null}
        <div className={this.state.editable ? s.tagListItemWrapperEditting : s.tagListItemWrapper}>
          <DragHandle />
          <div className={this.state.editable ? s.vRuleEditting : s.vRule} />
          {this.state.editable
            ? <input
              autoFocus={true}
              ref={(input) => { this.textInput = input }}
              value={this.state.tagName}
              onChange={this.handleChange}
              onClick={this.handleClick}
              onKeyUp={this.handleSetTagOnEnter}
              className={s.noBorderInput}
              placeholder={'Edit this tag name'}/>
            : <div className={s.tagName}>{this.props.tag.tagValue}</div>}
          <div className={s.smallButtonWrapper}>
          <div className={this.state.editable ? s.vRuleEditting : s.vRule} />
            {!this.state.editable
              ? <div
                  className={s.smallEdit}
                  onClick={this.handleEdit}>
                  {'edit'}
                </div>
              : <div
                  className={s.smallEdit}
                  onClick={this.handleSetTag}>
                  {'save'}
                </div>}
            <div className={this.state.editable ? s.smallRemoveInactive : s.smallRemove}
              onClick={this.handleTryDelete}>
              {this.state.editable ? 'remove' : 'remove'}
            </div>
          </div>
        </div>
      </li>
    )
  }
}

const SortableListWrapper = SortableContainer((props) => {
  // Wraps the sortable List - required for re-order
  return (
    <SortableList {...props}/>
  )
})

class SortableList extends React.Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    handleUpdateTag: PropTypes.func.isRequired,
    handleEditingTag: PropTypes.func.isRequired,
    tagEditingIndex: PropTypes.number,
    handleremoveTag: PropTypes.func.isRequired,
  }
  render () {
    return (
      <ul className={s.itemLists}>
        {this.props.tags.map(function (tag, index) {
          return (
            <SortableItem
              index={index}
              key={index}
              tagIndex={index}
              tag={tag}
              handleUpdateTag={this.props.handleUpdateTag}
              tagEditingIndex={this.props.tagEditingIndex}
              handleEditingTag={this.props.handleEditingTag}
              handleremoveTag={this.props.handleremoveTag}/>
          )
        }, this)}
      </ul>
    )
  }
}

export class PutTags extends React.Component {
  static propTypes = {
    handleSetCategoryTags: PropTypes.func.isRequired,
    handleSetDeletedTags: PropTypes.func.isRequired,
    tags: PropTypes.array.isRequired,
    loaded: PropTypes.bool.isRequired,
  }
  constructor (props) {
    super(props)
    this.state = {
      tagName: '',
      loaded: false,
      tagEditingIndex: null,
      emptyTags: true,
      tags: [],
    }
    this.focus = this.focus.bind(this)
  }
  focus = () => {
    this.textInput.focus()
  }
  handleTagChange = (e) => {
    this.setState({
      tagName: e.target.value,
    })
    this.handleEditingTag(null)
  }
  handleSetTagEnter = (event) => {
    if (event.key === 'Enter' && this.state.tagName !== '') {
      this.handleNewTag()
    }
  }
  handleEditingTag = (index) => {
    // Sets the index # of the tag currently being edited
    this.setState({
      tagEditingIndex: index,
    })
  }
  handleNewTag = () => {
    // Creates a new Tag at the last index in the array with null Id
    let alteredTags = this.props.tags
    let newItemIndex = this.props.tags.length
    alteredTags[newItemIndex] = {tagValue: this.state.tagName, tagIndex: newItemIndex, tagId: null}
    this.props.handleSetCategoryTags(alteredTags)
    this.setState({
      tagName: '', // Nulls the input box value
    })
    this.handleEditingTag(null)
  }
  handleUpdateTag = (val, index, tagId) => {
    // Updates a tagValue and updates the Category state with the new values
    let alteredTags = this.props.tags
    alteredTags[index] = {tagValue: val, tagIndex: index, tagId: tagId}
    this.props.handleSetCategoryTags(alteredTags) // Updates Category Tags
    this.handleEditingTag(null)
    this.props.notifyWithBanner(`Tag has been edited`, 'confirm')
  }
  handleremoveTag = (tagId, index, name) => {
    /*
      If tag Id is not null it's Id to the deleted tags array and confirm
      If it's null adds a deleted prop - this helps to filter out tags that shouldn't be submitted
      Accepts tagId and index in array
    */
    this.props.handleSetDeletedTags(tagId, index, name)
    this.props.notifyWithBanner(`Tag has been deleted`, 'confirm')
  }

  onSortStart = () => {
    // This function is called by react-sortable-hoc when sorting starts - remove any edit states on tags
    this.handleEditingTag(null)
  }
  onSortEnd = ({oldIndex, newIndex, collection}) => {
    // This function is called by react-sortable-hoc when sorting ends
    // Updates the index values of the tags to match the order
    // Sets state in putCategory.js
    let newTags = arrayMove(this.props.tags, oldIndex, newIndex) // Resorts array
    newTags.map(function (tag, index) {
      tag.tagIndex = index
    })
    this.handleEditingTag(null)
    this.props.handleSetCategoryTags(newTags)
  }
  render () {
    return (
      <div className={s.tags}>
        <div className={s.columnTitle}>{'Edit Tags'}</div>
        <ul className={s.tagList}>
          <SortableListWrapper
            tags={this.props.tags}
            handleUpdateTag={this.handleUpdateTag} // Updates tags
            handleEditingTag={this.handleEditingTag} // Sets the index of the tag thats being edited
            handleremoveTag={this.handleremoveTag} // Removes a tag
            tagEditingIndex={this.state.tagEditingIndex} // The value of the tag thats curerntly being edited
            onSortStart={this.onSortStart}
            onSortEnd={this.onSortEnd}
            useDragHandle={true}/>
        </ul>
        <div className={s.newTagWrapper}>
          <div className={s.minorButtonWrapper}>
            <input className={s.addNewTagInput}
            autoFocus={true}
            value={this.state.tagName}
            onChange={this.handleTagChange}
            onKeyUp={this.handleSetTagEnter} // if key === enter
            placeholder={'Add a new tag'}/>
            <button className={s.saveNewTagButton} onClick={this.state.tagName === '' ? null : this.handleNewTag}>{'save'}</button>
          </div>
        </div>
      </div>
    )
  }
}
