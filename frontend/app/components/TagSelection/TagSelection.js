import React from 'react'
import Category from 'components/Category/Category'
import s from './styles.css'

// These categories are fixed and cannot be updated by admins or users. They are present in every tenency. Format must conform to the category and tag structure (see api.js)
const fixedCategories = [
  {
    'categoryName': 'Collateral Type',
    'categoryId': '00',
    'tags': [
      {'tagId': 'success_story', 'tagValue': 'Success Story', tagIndex: 0},
      {'tagId': 'marketing_material', 'tagValue': 'Marketing Material', tagIndex: 1},
      {'tagId': 'delighted_customer', 'tagValue': 'Delighted Customer', tagIndex: 2},
    ],
  },
  {
    'categoryName': 'Referenceability',
    'categoryId': '00',
    'tags': [
      {'tagId': 'ask', 'tagValue': 'You can request a reference', tagIndex: 0},
      {'tagId': 'yes', 'tagValue': 'This client will serve as a reference', tagIndex: 1},
    ],
  },
]

function MakeCategoryElements (props) {
  let openCategoriesArray = Object.keys(props.selectedCategories)
  // Creates a temp arrray of Ids to check if the category should be displayed open or not.
  // Important to check when getting values from existing Collateral on editCollateral page or they will not reflect the state of the collateral
  return (
    <div>
      {props.categories.map(function (category, index) {
        return (
          <Category
            handleFilterFeed={props.handleFilterFeed}
            style={props.style} // Styles tags differently based on where they are rendered (FindCollateral vs. Add/edit Collateral)
            open={openCategoriesArray.includes(category.categoryId.toString())}
            // Checks the categoryId against the openCategoriesArray created above and expands the category if true
            key={index}
            category={category}
            filtersCleared={props.filtersCleared}
            selectedTags={openCategoriesArray.includes(category.categoryId.toString()) ? props.selectedCategories[category.categoryId] : {}}/>)
            // selectedTags passes the active tags on editCollateral page to filter for selected/unselected tags in ToggleTag.js
      })}
    </div>
  )
}

function MakeSpecialCategoryElements (props) {
  return (
    <span>
      <Category
        handleFilterFeed={props.handleFilterFeed}
        style={props.style}
        expanded={true}
        category={props.specialCategories[0]}
        filtersCleared={props.filtersCleared}
        selectedTags={{}}/>
      <Category
        handleFilterFeed={props.handleFilterFeed}
        style={props.style}
        category={props.specialCategories[1]}
        filtersCleared={props.filtersCleared}
        selectedTags={{}}/>
    </span>
  )
}

export default class TagSelection extends React.Component {
  static get propTypes () {
    return {
      currentUser: React.PropTypes.object,
      categories: React.PropTypes.array,
      handleFilterFeed: React.PropTypes.func.isRequired,
      style: React.PropTypes.string,
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      categories: [],
      fixedCats: fixedCategories,
    }
  }
  render () {
    let selectedCategories = this.props.collateralLoaded && this.props.isEditCollateralPage ? this.props.originalCollateral.tagsByCategory : {}
    return (
      <div className={s.tagSelectWrapper}>
        {this.props.style === 'findCollateral' // only render special filters if on FindCollateral page
        ? <MakeSpecialCategoryElements specialCategories={this.state.fixedCats} {...this.props} />
        : null}
        <MakeCategoryElements selectedCategories={selectedCategories} {...this.props} />
      </div>
    )
  }
}
