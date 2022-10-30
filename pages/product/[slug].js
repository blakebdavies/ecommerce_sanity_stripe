import React, {useState} from 'react';
import {AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar} from 'react-icons/ai';

import {client, urlFor} from '../../lib/client';
import {Product} from "../../components";

const ProductDetails = ({product, products}) => {
    const {image, name, details, price} = product;
    const [index, setIndex]= useState(0);

    return (
        <div>
            <div className="product-detail-container">
                <div>
                    <div className="small-images-container">
                        <img
                            className="product-detail-image"
                            src={urlFor(image && image[index])}
                            alt="product"/>
                    </div>
                    <div className="small-images-container">
                        {image?.map((item, i) => (
                            <img
                                src={urlFor(item)}
                                className={i === index ? 'small-image selected-image' : 'small-image'}
                                onMouseEnter={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </div>
                <div className="product-detail-desc">
                    <h1>{name}</h1>
                    <div className="reviews">
                        <div>
                            <AiFillStar/>
                            <AiFillStar/>
                            <AiFillStar/>
                            <AiFillStar/>
                            <AiOutlineStar/>
                        </div>
                        <p>
                            (20)
                        </p>
                    </div>
                    <h4>Details: </h4>
                    <p>{details}</p>
                    <p className="price">£{price}</p>
                    <div className="quantity">
                        <h3>Quantity:</h3>
                        <p className="quantity-desc">
                            <span className="minus" onClick=""><AiOutlineMinus/></span>
                            <span className="num" onClick="">0</span>
                            <span className="plus" onClick=""><AiOutlinePlus/></span>
                        </p>
                    </div>
                    <div className="buttons">
                        <button
                            type="button"
                            className="add-to-cart"
                        >
                            Add to Cart
                        </button>
                        <button
                            type="button"
                            className="buy-now"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            <div className="recommended-products-wrapper">
                <h2>You may also like</h2>
                <div className="marquee">
                    <div className="recommended-products-container track">
                        {products.map((item) => (
                            <Product key={item._id} product={item}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

    const products = await client.fetch(query);

    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }));

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({params: {slug}}) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]'

    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);

    return {
        props: {products, product}
    }
}

export default ProductDetails;
