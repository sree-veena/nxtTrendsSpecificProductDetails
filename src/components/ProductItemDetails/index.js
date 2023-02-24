import Loader from 'react-loader-spinner'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const requestStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: {},
    quantity: 1,
    requestStatus: requestStatusConstants.initial,
  }

  componentDidMount() {
    this.productItemApi()
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  productItemApi = async () => {
    this.setState({requestStatus: requestStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)

    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken)
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    // console.log(response)
    if (response.ok) {
      const data = await response.json()
      //   console.log(data)
      const updatedData = {
        availability: data.availability,
        imageUrl: data.image_url,
        brand: data.brand,
        title: data.title,
        description: data.description,
        id: data.id,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products,
        totalReviews: data.total_reviews,
      }

      const updatedSimilarProducts = updatedData.similarProducts.map(each => ({
        imageUrl: each.image_url,
        brand: each.brand,
        title: each.title,
        price: each.price,
        rating: each.rating,
        id: each.id,
      }))
      //   console.log(updatedData)
      this.setState({
        productDetails: updatedData,
        similarProducts: updatedSimilarProducts,
        requestStatus: requestStatusConstants.success,
      })
    } else {
      this.setState({requestStatus: requestStatusConstants.failure})
    }
  }

  renderProductDetails = () => {
    const {productDetails, quantity, similarProducts} = this.state
    // console.log(productDetails)
    const {
      title,
      imageUrl,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails
    return (
      <>
        <div className="product-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-details-container">
            <h1 className="product-name" key="title">
              {title}
            </h1>
            <p className="price">Rs {price}</p>
            <div className="review-rating-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews} reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="stock-status">
              <span className="availability">Available:</span> {availability}
            </p>
            <p className="stock-status">
              <span className="availability">Brand: </span>
              {brand}
            </p>
            <hr className="h-line" />
            <div className="cart-quantity">
              <button
                type="button"
                className="cart-minus-btn"
                value="minus"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="item-quantity">{quantity}</p>
              <button
                type="button"
                className="cart-plus-btn"
                value="plus"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-product-main-heading">Similar Products</h1>
        <ul className="similar-products-container">
          {similarProducts.map(eachProduct => (
            <li
              className="similar-products-list-container"
              key={eachProduct.title}
            >
              <Link to={`/products/${eachProduct.id}`}>
                <img
                  src={eachProduct.imageUrl}
                  alt="similar product"
                  className="similar-products-logo"
                />
                <p className="similar-product-title">{eachProduct.title}</p>
                <p className="similar-product-brand">by {eachProduct.brand}</p>
                <div className="similar-products-rating-container">
                  <p className="similar-product-price">
                    Rs {eachProduct.price}
                  </p>
                  <div className="similar-products-button-rating-container">
                    <p className="rating">{eachProduct.rating}</p>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                      className="star"
                    />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1 className="failure-desc">Product Not Found</h1>
      <Link to="/products">
        <button
          type="button"
          className="continue-btn"
          onClick={this.renderProductsHomePage}
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderAllProductDetails() {
    const {requestStatus} = this.state

    switch (requestStatus) {
      case requestStatusConstants.success:
        return this.renderProductDetails()
      case requestStatusConstants.inProgress:
        return this.renderLoader()
      case requestStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllProductDetails()}
      </>
    )
  }
}

export default ProductItemDetails
