import styles from "./TrustSections.module.css";
import Image from "next/image";
import husnalogyLogo from "../../../public/brands/husnalogy.webp";
import taraLogo from "../../../public/brands/tara.webp";
import lusaLogo from "../../../public/brands/lusa.webp";

const brands = ["Husnalogy", "TARABD", "Lusa Tintoria"];
const brandLogos = [
  { name: "Husnalogy", image: husnalogyLogo, id: "husnalogy" },
  { name: "TARA", image: taraLogo, id: "tara" },
  { name: "Lusa Tintoria", image: lusaLogo, id: "lusa" },
];
const countries = [
  { name: "America", code: "us" },
  { name: "Canada", code: "ca" },
  { name: "Italy", code: "it" },
  { name: "Bangladesh", code: "bd" },
] as const;

function Flag({ code }: { code: typeof countries[number]["code"] }) {
  return <svg viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={styles.flag}>
    {code === "us" && <>
      <path fill="#fff" d="M0 0h60v40H0z" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} fill="#b22234" d={`M0 ${i * 80 / 13}h60v${40 / 13}H0z`} />)}
      <path fill="#3c3b6e" d="M0 0h26v22H0z" />
      {Array.from({ length: 50 }, (_, i) => {
        const row = Math.floor(i / 11) * 2 + (i % 11 >= 6 ? 1 : 0);
        const col = i % 11 >= 6 ? i % 11 - 6 : i % 11;
        return <path key={i} fill="#fff" transform={`translate(${2.2 + col * 4.3 + (row % 2 ? 2.15 : 0)} ${1.5 + row * 2.35})`} d="m0-1 .3.7.8.1-.6.5.2.8L0 .7l-.7.4.2-.8-.6-.5.8-.1Z" />;
      })}
    </>}
    {code === "ca" && <>
      <path fill="#fff" d="M0 0h60v40H0z" /><path fill="#d92332" d="M0 0h15v40H0zM45 0h15v40H45zM30 7l3 7 3-2-1 8 5-4 1 3 4-1-3 8 2 2-11 2 1 5h-3l1-5-11-2 2-2-3-8 4 1 1-3 5 4-1-8 3 2z" />
    </>}
    {code === "it" && <><path fill="#fff" d="M0 0h60v40H0z" /><path fill="#009246" d="M0 0h20v40H0z" /><path fill="#ce2b37" d="M40 0h20v40H40z" /></>}
    {code === "bd" && <><path fill="#006a4e" d="M0 0h60v40H0z" /><circle fill="#f42a41" cx="27" cy="20" r="12" /></>}
  </svg>;
}

export function TrustSections() {
  return <>
    <section className={styles.trusted} aria-labelledby="trusted-title">
      <h2 id="trusted-title">Trusted by leading brands</h2>
      <ul className={styles.brands} aria-label="Trusted brands">
        {brandLogos.map(brand => <li key={brand.id}>
          <Image src={brand.image} alt={brand.name} className={styles.brandLogo} data-brand={brand.id} sizes="220px" />
        </li>)}
      </ul>
    </section>
    <section className={styles.reach} aria-labelledby="reach-title">
      <p className={styles.eyebrow}>A Growing Global Reach</p>
      <h2 id="reach-title">Working with ambitious<br className={styles.headingBreak} /> businesses across borders.</h2>
      <p className={styles.description}>From local businesses to international brands, I work with teams across different markets to build stronger digital experiences and support business growth.</p>
      <div className={styles.markets}>
        <div className={styles.globalSummary}>
          <ul className={styles.countries} aria-label="Client countries">
            {countries.map(country => <li key={country.code} aria-label={country.name} title={country.name}>
              <Flag code={country.code} /><span className="sr-only">{country.name}</span>
            </li>)}
          </ul>
          <p>Clients across 4 countries</p>
        </div>
        <ul className={styles.clientTags} aria-label="International clients">
          {brands.map(brand => <li key={brand} translate="no">{brand}</li>)}
        </ul>
      </div>
    </section>
  </>;
}
