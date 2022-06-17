import React from 'react';

/**
 * @typedef {{}} AssetsProps
 */

/** @type {(props: AssetsProps) => JSX.Element} */
const Assets = (props) => {
  const { assets } = props;
  return (
    <div className='card-container'>
      {assets?.map((asset) => {
        return (
          <div className='card' key={asset.id}>
            <div className='wrapper-img'>
              <img className='img-assets' src={asset.image_url} alt='' />
            </div>
            <div className='card-title'>{asset.name}</div>
            <div className='card-description'>{asset.asset_contract.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Assets;
