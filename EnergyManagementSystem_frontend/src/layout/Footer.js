import React from 'react'
import "./Footer.css"
const Footer = () => {
  return (
    <>
    <div className="footer-section-1">
        <p>Website feedback? Let us know </p>
    </div>
    <div className="footer-section-2">

        <div className="label-container">
            <div className="label-box">
                <img src="https://www.sephora.com/img/ufe/icons/find-store.svg"  alt='img'/>
                <div>
                    <span>Find a store</span>
                    <p>Choose Your Store</p>
                </div>
            </div>
            <div className="label-box">
                <img src="https://www.sephora.com/img/ufe/icons/call.svg" alt='img'/>
                <div>
                    <span>
                        1-877-737-4672
                    </span>
                    <p>TTY: 1-888-866-9845 </p>
                </div>
            </div>
            <div className="label-box">
                <img src="https://www.sephora.com/img/ufe/icons/find-store.svg"  alt='img'/>
                <div>
                    <span>Get the App</span>
                    <p>Text "APP" to 36681</p>
                </div>
            </div>
            <div className="label-box">
                <img src="https://www.sephora.com/img/ufe/icons/cc-outline-ko.svg  " alt='img' />
        
            </div>
            <h6>Region & Language</h6>
                <div className="countries_box">
                <img className="countries" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/300px-Flag_of_Europe.svg.png" alt='img'/>
                <p>UE - English</p>
                </div>
                <div className="countries_box">
                <img className="countries" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/900px-Flag_of_Romania.svg.png" alt='img'/>
                <p>Romania - Romanian</p>
                </div>
        </div>
        <hr />
        
        <div className="footer-section-4">
            <div>
                <p>© 2024 BeGreen Romania, Inc. All rights reserved.</p>
                <span>Privacy Policy</span> <span>Terms of Use Accessibility</span>
                <span>Sitemap</span> <span> CA - Do Not Sell My Personal Information</span>
            </div>

            <div id="icons">
                <img src="https://www.sephora.com/img/ufe/icons/instagram-ko.svg" alt='img'/>
                <img src="https://www.sephora.com/img/ufe/icons/facebook-ko.svg" alt='img'/>
                <img src="https://www.sephora.com/img/ufe/icons/twitter-ko.svg" alt='img'/>
                <img src="https://www.sephora.com/img/ufe/icons/youtube-ko.svg" alt='img'/>
                <img src="https://www.sephora.com/img/ufe/icons/pinterest-ko.svg" alt='img'/>
                <img src="https://www.sephora.com/img/ufe/icons/snapchat-ko.svg" alt='img'/>
                <img src="https://www.sephora.com/img/ufe/icons/tiktok-ko.svg" alt='img'/>

            </div>

        </div>
    </div>
    </>
  )
}

export default Footer;

