import React from 'react';

import styles from './Footer.module.scss';

const year = new Date().getFullYear();

function Footer({modalProps}: any) {

  const showPolicy = () => {
    modalProps.showModal({
      title: `Privacy Notice`,
      body: (<><p>This privacy notice discloses the privacy practices for BEERFORGE. This privacy notice applies solely to information collected by this website. It will notify you of the following:</p>
      <ul>
        <li>What personally identifiable information is collected from you through the website, how it is used and with whom it may be shared.</li>
        <li>What choices are available to you regarding the use of your data.</li>
        <li>The security procedures in place to protect the misuse of your information.</li>
        <li>How you can correct any inaccuracies in the information.</li>
      </ul>

      <h2>Information Collection, Use, and Sharing</h2>
      <p>We are the sole owners of the information collected on this site. We only have access to/collect information that you voluntarily give us via email or other direct contact from you. We will not sell or rent this information to anyone.</p>
      
      <p>We will use your information to respond to you, regarding the reason you contacted us. We will not share your information with any third party outside of our organization, other than as necessary to fulfill your request, e.g. to ship an order.</p>
      
      <p>Unless you ask us not to, we may contact you via email in the future to tell you about specials, new products or services, or changes to this privacy policy.</p>
      
      <h2>Your Access to and Control Over Information</h2>
      <p>You may opt out of any future contacts from us at any time. You can do the following at any time by contacting us via the email address or phone number given on our website:</p>
      <ul>
        <li>See what data we have about you, if any.</li>
        <li>Change/correct any data we have about you.</li>
        <li>Have us delete any data we have about you.</li>
        <li>Express any concern you have about our use of your data.</li>
      </ul>

      <h2>Security</h2>
      <p>We take precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline.</p>
      
      <p>While we use encryption to protect sensitive information transmitted online, we also protect your information offline. Only employees who need the information to perform a specific job (for example, billing or customer service) are granted access to personally identifiable information. The computers/servers in which we store personally identifiable information are kept in a secure environment.</p>
      
      <h2>Cookies</h2>
      <p>Some of our business partners may use cookies on our site (for example, advertisers). However, we have no access to or control over these cookies.</p>
      
      
      <p>If you feel that we are not abiding by this privacy policy, you should contact us immediately via email.</p></>),
      classOverride: styles.modalClass,
      buttons: <>
          <button
            className="button"
            onClick={() => modalProps.hideModal()}
          >Got it</button>
        </>
    });
  };

  const showTerms = () => {
    modalProps.showModal({
      title: `BEERFORGE Terms and Conditions`,
      body: (<><h2>1. Introduction.</h2>
        <p>These Website Standard Terms And Conditions (these “Terms” or these “Website Standard Terms And Conditions”) contained herein on this webpage, shall govern your use of this website, including all pages within this website (collectively referred to herein below as this “Website”). These Terms apply in full force and effect to your use of this Website and by using this Website, you expressly accept all terms and conditions contained herein in full. You must not use this Website, if you have any objection to any of these Website Standard Terms And Conditions.</p>
        
        <p>This Website is not for use by any minors (defined as those who are not at least 18 years of age), and you must not use this Website if you a minor.</p>
        
        <h2>2. Intellectual Property Rights.</h2>
        <p>Other than content you own, which you may have opted to include on this Website, under these Terms, BEERFORGE and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved.</p>
        
        <p>You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website.</p>
        
        <h2>3. Restrictions.</h2>
        <p>You are expressly and emphatically restricted from all of the following:</p>
        
        <ul>
          <li>publishing any Website material in any media;</li>
          <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
          <li>publicly performing and/or showing any Website material;</li>
          <li>using this Website in any way that is, or may be, damaging to this Website;</li>
          <li>using this Website in any way that impacts user access to this Website;</li>
          <li>using this Website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the Website, or to any person or business entity;</li>
          <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website, or while using this Website;</li>
          <li>using this Website to engage in any advertising or marketing;</li>
        </ul>
        
        <p>Certain areas of this Website are restricted from access by you and BEERFORGE may further restrict access by you to any areas of this Website, at any time, in its sole and absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality of such information.</p>
        
        <h2>4. Your Content.</h2>
        <p>In these Website Standard Terms And Conditions, “Your Content” shall mean any audio, video, text, images or other material you choose to display on this Website. With respect to Your Content, by displaying it, you grant BEERFORGE a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
        
        <p>Your Content must be your own and must not be infringing on any third party’s rights. BEERFORGE reserves the right to remove any of Your Content from this Website at any time, and for any reason, without notice.</p>
        
        <h2>5. No warranties.</h2>
        <p>This Website is provided “as is,” with all faults, and BEERFORGE makes no express or implied representations or warranties, of any kind related to this Website or the materials contained on this Website. Additionally, nothing contained on this Website shall be construed as providing consult or advice to you.</p>
        
        <h2>6. Limitation of liability.</h2>
        <p>In no event shall BEERFORGE, nor any of its officers, directors and employees, be liable to you for anything arising out of or in any way connected with your use of this Website, whether such liability is under contract, tort or otherwise, and BEERFORGE, including its officers, directors and employees shall not be liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
        
        <h2>7. Indemnification.</h2>
        <p>You hereby indemnify to the fullest extent BEERFORGE from and against any and all liabilities, costs, demands, causes of action, damages and expenses (including reasonable attorney’s fees) arising out of or in any way related to your breach of any of the provisions of these Terms.</p>
        
        <h2>8. Severability.</h2>
        <p>If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole, and such provisions shall be deleted without affecting the remaining provisions herein.</p>
        
        <h2>9. Variation of Terms.</h2>
        <p>BEERFORGE is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review such Terms on a regular basis to ensure you understand all terms and conditions governing use of this Website.</p>
        
        <h2>10. Assignment.</h2>
        <p>BEERFORGE shall be permitted to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification or consent required. However, .you shall not be permitted to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.</p>
        
        <h2>11. Entire Agreement.</h2>
        <p>These Terms, including any legal notices and disclaimers contained on this Website, constitute the entire agreement between BEERFORGE and you in relation to your use of this Website, and supersede all prior agreements and understandings with respect to the same.</p>
        
        <h2>12. Governing Law & Jurisdiction.</h2>
        <p>These Terms will be governed by and construed in accordance with the laws of the State of Washington, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Washington for the resolution of any disputes.</p></>),
      classOverride: styles.modalClass,
      buttons: <>
          <button
            className="button"
            onClick={() => modalProps.hideModal()}
          >Got it</button>
        </>
    });
  };

  return(
    <footer className={styles.footer}>
      <p>&copy; Copyright {year} - BeerForge</p>
      <p>
        <button
          className={`button button--link ${styles.link}`}
          onClick={showPolicy}
        >Privacy Policy</button>
        &nbsp;|&nbsp;
        <button
          className={`button button--link ${styles.link}`}
          onClick={showTerms}
        >Terms &amp; Conditions</button>
        </p>
    </footer>
  );
};

export default Footer;