import React from 'react'
import s from './styles.css'
import ToggleTag from 'components/ToggleTag/ToggleTag'

function ComposeTags (props) {
  let selectedTagsArray = Object.keys(props.selectedTags).map((k) => props.selectedTags[k].tagId)
  // Makes a temp array of tagsIds from the tags passed from the active categories
  // Required for editCollateral Page to differentiate between actively selected Tags & unselected in an open catgeory
  return (
    <ul className={props.open ? s.open : s.closed}>
      {props.tags.map(function (tag, index) {
        return (
          <ToggleTag
            style={props.style}
            key={index}
            tag={tag}
            categoryName={props.category.categoryName}
            tagSelected={selectedTagsArray.includes(tag.tagId)} // bool
            // Sets tagSelected if the tagId is present in the selectedTagsArray created above
            handleFilterFeed={props.handleFilterFeed}
            filtersCleared={props.filtersCleared}
            expanded={props.expanded}/>
        )
      })}
    </ul>
  )
}

export default class Category extends React.Component {
  static propTypes = {
    category: React.PropTypes.object,
    open: React.PropTypes.bool,
    handleFilterFeed: React.PropTypes.func,
    style: React.PropTypes.string,
  }
  constructor (props) {
    super(props)
    this.state = {
      open: this.props.open,
    }
  }
  componentDidMount = () => {
    this.setState({
      open: (this.props.open),
    })
  }
  handleToggleCategoryDisplay = () => {
    this.setState({
      open: !(this.state.open), // Opens and closes categories to display tags
    })
  }

  render () {
    return (
      <div className={s.categoryWrapper}>
          <div className={s.categoryHeader} onClick={!this.props.expanded ? this.handleToggleCategoryDisplay : null}>
              <p>
                {!this.props.expanded ? <span className={s.arrow}>{this.state.open ? '▼  ' : '▶ '}</span> : null}
                {this.props.category.categoryName}
              </p>
          </div>
          <ComposeTags tags={this.props.category.tags} expanded={this.state.open} {...this.props}/>
      </div>
    )
  }
}
