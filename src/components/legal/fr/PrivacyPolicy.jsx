import { encodeEmailToElement } from "../../../libs/Misc";
import config from "../../../config";

export default function PrivacyPolicy() {
  const contents = (
    <>
      <h2>Politique de Confidentialité</h2>
      <p><strong>Informations conformément à l'art. 13 du Code de la Vie Privée</strong></p>
      <p><b>Conformément au produit 13 du décret législatif 196/2003, nous vous fournissons les informations suivantes.</b></p>
      <p>Chez <strong><span id="site">{config.siteUrl}</span></strong>, nous croyons que la confidentialité de nos visiteurs est extrêmement importante. Ce document détaille les types d'informations personnelles collectées et enregistrées par notre site et comment elles sont utilisées.</p>
      <h3>Fichiers journaux</h3>
      <p>Comme de nombreux autres sites web, le nôtre utilise des fichiers journaux. Ces fichiers enregistrent simplement les visiteurs du site - une procédure standard pour les hébergeurs et les services d'analyse d'hébergement.</p>
      <p>Les informations contenues dans les fichiers journaux comprennent les adresses de protocole Internet (IP), le type de navigateur, le fournisseur de services Internet (ISP), des informations telles que la date et l'heure, les pages de référence, les pages d'entrée et de sortie ou le nombre de clics.</p>
      <p>Ces informations sont utilisées pour analyser les tendances, administrer le site, suivre le mouvement des utilisateurs sur le site et recueillir des informations démographiques. Les adresses IP et autres informations ne sont pas liées à des informations personnelles identifiables, donc <strong>toutes les données sont collectées de manière absolument anonyme</strong>.</p>
      <div id="cookies" style={{display: "block"}}>
        <h3>Ce site web utilise des cookies</h3>
        <p>Les cookies sont de petits fichiers texte qui sont automatiquement placés sur le navigateur de l'ordinateur. Ils contiennent des informations de base sur la navigation Internet et sont reconnus par le navigateur chaque fois que l'utilisateur visite le site.</p>
        <h3>Politique des cookies</h3>
        <p>Ce site utilise des cookies, y compris des cookies tiers, pour améliorer l'expérience de navigation, permettre aux utilisateurs d'utiliser des services en ligne et surveiller la navigation sur le site.</p>
        <h3>Comment désactiver les cookies</h3>
        <p>Il est possible de désactiver les cookies directement depuis le navigateur utilisé, en accédant aux paramètres (préférences ou options) : ce choix peut limiter certaines fonctionnalités de navigation du site.</p>
        <h3>Gestion des cookies</h3>
        <p>Les cookies utilisés sur ce site peuvent appartenir aux catégories décrites ci-dessous.</p>
        <ul>
          <li><strong>Activités strictement nécessaires au fonctionnement</strong>
            <br />
            Ces cookies sont de nature technique et permettent au site de fonctionner correctement. Par exemple, ils maintiennent l'utilisateur connecté pendant la navigation, empêchant le site de demander de se connecter plusieurs fois pour accéder aux pages suivantes.
          </li>
          <li><strong>Activité de sauvegarde des préférences</strong>
            <br />
            Ces cookies permettent de mémoriser les préférences sélectionnées par l'utilisateur pendant la navigation, par exemple, ils permettent de définir la langue.
          </li>
          <li><strong>Activités statistiques et mesure d'audience (ex : Google Analytics)</strong>
            <br />
            Ces cookies nous aident à comprendre, à travers des données collectées de manière anonyme et agrégée, comment les utilisateurs interagissent avec les sites web en fournissant des informations relatives aux sections visitées, au temps passé sur le site, aux éventuels dysfonctionnements. Cela aide à améliorer les performances des sites web.
          </li>
          <li><strong>Cookies de médias sociaux (ex : Facebook)</strong>
            <br />
            Ces cookies tiers sont utilisés pour intégrer certaines fonctionnalités communes des principaux médias sociaux et les fournir au sein du site. En particulier, ils permettent l'inscription et l'authentification sur le site via facebook et google connect, le partage et les commentaires des pages du site sur les réseaux sociaux, l'activation des fonctionnalités "like" sur Facebook et "+1" sur G+.
          </li>
        </ul>
      </div>
      <div id="suppliers" style={{display: "none"}}>
        <h3>Fournisseurs Tiers</h3>
        <p>Les fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des publicités basées sur les visites précédentes de l'utilisateur sur ce site.</p>
        <p>L'utilisation de cookies publicitaires permet à Google et ses partenaires de diffuser des publicités aux utilisateurs de ce site (et sur d'autres sites) en fonction des données statistiques collectées sur ce site et sur les sites web des partenaires de Google.</p>
        <p>Les utilisateurs peuvent choisir de se désinscrire de la publicité personnalisée en visitant <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Paramètres des publicités</a>.</p>
        <p>En visitant la page {config.siteUrl}, vous pouvez désactiver les cookies des fournisseurs tiers.</p>
      </div>
      <div id="partners" style={{display: "none"}}>
        <h3>Nos partenaires publicitaires</h3>
        <p>Certains de nos partenaires publicitaires peuvent utiliser des cookies sur notre site pour collecter anonymement les données de navigation des utilisateurs. Nos partenaires publicitaires incluent :</p>
        <ul>
          <li id="amazon" style={{display: "none"}}>Amazon</li>
          <li id="ebay" style={{display: "none"}}>Ebay</li>
          <li id="other_partners" style={{display: "none"}}><span id="partner"></span></li>
        </ul>
        <p>Les publicités des fournisseurs tiers opèrent des réseaux publicitaires qui utilisent la technologie des cookies dans leurs publicités respectives et liens qui apparaissent sur notre site. Les publicités sont ensuite envoyées directement à votre navigateur. Ils recevront automatiquement votre adresse IP. D'autres technologies (telles que les cookies ou JavaScript) peuvent également être utilisées par les réseaux publicitaires tiers de notre site pour mesurer l'efficacité de leurs campagnes publicitaires et/ou personnaliser le contenu publicitaire que vous voyez sur le site.</p>
        <p>Notre site n'a pas accès ou ne contrôle pas ces cookies utilisés par les publicitaires tiers.</p>
        <h3>Politiques de confidentialité des tiers</h3>
        <p>Vous devez consulter les politiques de confidentialité respectives de ces serveurs tiers pour plus d'informations sur leurs pratiques et pour obtenir des instructions sur la façon de se désengager de certaines pratiques.</p>
        <p>Notre politique de confidentialité ne s'applique pas aux fournisseurs tiers et aux partenaires publicitaires, et nous ne pouvons pas contrôler les activités de ces autres publicitaires ou sites web.</p>
        <p>Si vous souhaitez désactiver les cookies, vous pouvez le faire via les options de votre navigateur individuel. Des informations supplémentaires sur la gestion des cookies avec des navigateurs web spécifiques peuvent être trouvées sur les sites web des navigateurs respectifs</p>
      </div>
      <h3>Objectif du traitement</h3>
      <p>Les données peuvent être collectées pour un ou plusieurs des objectifs suivants :</p>
      <ul>
        <li>fournir l'accès aux zones restreintes du Portail et des Portails/sites connectés à celui-ci et envoyer des communications, y compris commerciales, des actualités, des mises à jour sur les initiatives de ce site et des sociétés contrôlées et/ou connectées par celui-ci et/ou du Sponsor.</li>
        <li>transfert possible desdites données à des tiers, toujours dans le but de créer des campagnes de marketing par e-mail et d'envoyer des communications commerciales.</li>
        <li>effectuer les obligations établies par des lois ou des réglementations ;</li>
        <li>gestion des contacts ;</li>
      </ul>
      <h3>Méthodes de traitement</h3>
      <p>Les données seront traitées de la manière suivante :</p>
      <ul>
        <li>collecte de données avec mode d'opt simple, dans une base de données spécifique ;</li>
        <li>enregistrement et traitement sur support papier et/ou magnétique ;</li>
        <li>organisation des archives dans une forme principalement automatisée, conformément aux Réglementations Techniques sur les mesures de sécurité minimales, Annexe B du Code de la Vie Privée.</li>
      </ul>
      <h3>Caractère obligatoire</h3>
      <p>Toutes les données demandées sont requises.</p>
      <div id="treatment" style={{display: "none"}}>
        <h3>Destinataires des données personnelles</h3>
        <p>Les données collectées peuvent être divulguées à :</p>
        <ul>
          <li>entreprises et sociétés pour des activités de mailing direct ou similaires ;</li>
          <li>associations et fondations souhaitant acheter des espaces publicitaires sur les listes ou sur le site et/ou liés à la fourniture d'un service particulier.</li>
          <li>sujets qui doivent avoir accès aux données, comme requis par la loi ou les réglementations secondaires et/ou communautaires.</li>
        </ul>
      </div>
      <h3>Droits de l'intéressé</h3>
      <p>Conformément à l'art. 7 (Droit d'accès aux données personnelles et autres droits) du Code de la Vie Privée, nous vous informons que vos droits concernant le traitement des données sont :</p>
      <ul>
        <li>connaître, par un accès gratuit, l'existence d'un traitement de données pouvant vous concerner ;</li>
        <li>être informé de la nature et de l'objectif du traitement ;</li>
        <li>obtenir du propriétaire, sans délai :</li>
        <ul>
          <li>confirmation de l'existence ou non de données personnelles vous concernant, même si elles ne sont pas encore enregistrées, et la communication sous une forme intelligible desdites données et de leur origine, ainsi que la logique et les objectifs sur lesquels le traitement est basé ; la demande peut être renouvelée, sauf raisons justifiées, après un délai d'au moins quatre-vingt-dix jours ;</li>
          <li>l'annulation, la transformation en forme anonyme ou le blocage des données traitées en violation de la loi, y compris celles qui n'ont pas besoin d'être conservées aux fins pour lesquelles les données ont été collectées ou traitées ultérieurement ;</li>
          <li>mise à jour, correction ou, si intéressé, intégration des données existantes ;</li>
          <li>s'opposer en tout ou en partie pour des raisons légitimes au traitement des données personnelles vous concernant, même si elles sont pertinentes pour l'objectif de la collecte ;</li>
        </ul>
      </ul>
      <p>Veuillez noter que le responsable du traitement des données à tous les effets juridiques est :</p>
      <ul>
        <li>Entreprise de : <span id="company">{config.company.owner.name}</span></li>
        <li>Code fiscal / N° TVA : <span id="fiscalCode">{config.company.owner.fiscalCode}</span></li>
        <li>Adresse : <span id="address">{config.company.owner.streetAddress}</span></li>
        <li>Ville : <span id="zip">{config.company.owner.zipCode}</span> - <span id="city">{config.company.owner.city}</span> (<span id="province">{ config.company.owner.province }</span>) - <span id="country">{config.company.owner.country}</span></li>
        <li>Tél / Fax : <span id="telephone">{config.company.owner.phone}</span></li>
        <li>E-mail : <span id="email">{encodeEmailToElement(config.company.owner.email)}</span></li>
      </ul>
      <p>Pour exercer les droits prévus à l'art. 7 du Code de la Vie Privée ou pour la suppression de vos données de l'archive, il suffit de nous contacter via l'un des canaux mis à disposition.</p>
      <p>Toutes les données sont protégées par l'utilisation d'antivirus, de pare-feu et de protection par mot de passe.</p>
      <h3>Informations pour les enfants</h3>
      <p>Nous pensons qu'il est important de fournir une protection supplémentaire pour les enfants en ligne. Nous encourageons les parents et les tuteurs à passer du temps en ligne avec leurs enfants pour observer, participer et/ou surveiller et guider leur activité en ligne. Nous ne collectons pas de données personnelles de mineurs. Si un parent ou un tuteur pense que notre site a des informations personnelles d'un enfant dans sa base de données, veuillez nous contacter immédiatement (en utilisant l'e-mail fourni) et nous ferons tout notre possible pour supprimer ces informations dès que possible.</p>
      <p>Cette politique de confidentialité s'applique uniquement à nos activités en ligne et est valable pour les visiteurs de notre site web et concernant les informations partagées et/ou collectées. Cette politique ne s'applique pas aux informations collectées hors ligne ou par des canaux autres que ce site web.</p>
      <h3>Consentement</h3>
      <p>En utilisant notre site web, vous acceptez notre politique de confidentialité et ses conditions. Si vous souhaitez plus d'informations ou si vous avez des questions concernant notre politique de confidentialité, n'hésitez pas à nous contacter.</p>
    </>
  );

  return contents;
}