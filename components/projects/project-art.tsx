import type { Project } from "@/data/projects";

/** Abstract CSS illustrations for each project (not screenshots of the live sites). */
export function ProjectArt({ slug }: { slug: Project["slug"] }) {
  switch (slug) {
    case "husnalogy":
      return (
        <div className="preview-inner preview-hus">
          <div className="mini-top">
            <b>HUSNALOGY</b>
            <span>PERSONALISED GOODS ↗</span>
          </div>
          <div className="hus-shape">
            <span>
              Made
              <br />
              <i>personal.</i>
            </span>
            <div className="hus-stamp">H</div>
          </div>
          <span className="preview-caption">OBJECTS FOR YOUR MOMENTS</span>
        </div>
      );
    case "prichat":
      return (
        <div className="preview-inner preview-pri">
          <div className="pri-head">
            <span className="circle-small"></span>
            <b>prichat.</b>
            <span className="pri-menu">•••</span>
          </div>
          <div className="chat-bubbles">
            <span className="bubble b1">Hey!</span>
            <span className="bubble b2">Let’s talk ideas.</span>
            <span className="bubble b3">Sounds good ↗</span>
          </div>
          <div className="pri-input">
            Message… <span>↗</span>
          </div>
        </div>
      );
    case "tara":
      return (
        <div className="preview-inner preview-tara">
          <div className="tara-nav">
            TARA <span>COLLECTION</span>
          </div>
          <div className="tara-art">
            <div className="tara-oval"></div>
            <div className="tara-type">
              T<br />A<br />R<br />A
            </div>
            <div className="tara-number">
              NEW
              <br />
              SEASON
            </div>
          </div>
          <span className="preview-caption">MODERN EVERYDAY FASHION</span>
        </div>
      );
    case "minute-tracker":
      return (
        <div className="preview-inner preview-minute">
          <div className="minute-nav">
            <span>● MINUTE TRACKER</span>
            <span>FOCUS MODE</span>
          </div>
          <div className="minute-display">
            <span className="minute-small">CURRENT SESSION</span>
            <strong>
              01:28<span>:42</span>
            </strong>
            <div className="minute-line">
              {Array.from({ length: 10 }, (_, i) => (
                <i key={i}></i>
              ))}
            </div>
          </div>
          <div className="minute-actions">
            <span>◼ STOP SESSION</span>
            <span>↗ REPORT</span>
          </div>
        </div>
      );
  }
}
