import { Fragment, type CSSProperties } from "react";
import { InView } from "@/components/ui/InView";

const tiers = ["Client", "Framework", "Application", "Platform"];
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/** Layers come straight from the project data; connectors draw once as the diagram enters view. */
export function ArchitectureDiagram({ layers }: { layers: string[][] }) {
  return (
    <figure className="border border-line bg-white/40 px-4 py-10 md:px-10 md:py-12">
      <InView>
        <ol className="flex flex-col items-stretch">
          {layers.map((nodes, index) => (
            <Fragment key={nodes.join()}>
              {index > 0 && (
                <li aria-hidden className="grid grid-cols-[5rem_1fr] md:grid-cols-[7.5rem_1fr]">
                  <span />
                  <span className="relative mx-auto flex h-10 w-px flex-col items-center md:h-12">
                    <span className="draw-y h-full w-px bg-ink/50" style={delay(index * 220 - 110)} />
                    <span className="rise-in absolute -bottom-1 text-[0.5rem] leading-none text-ink/60" style={delay(index * 220)}>
                      ▼
                    </span>
                  </span>
                </li>
              )}
              <li className="grid grid-cols-[5rem_1fr] items-center md:grid-cols-[7.5rem_1fr]">
                <span className="label text-muted">{tiers[index] ?? `Layer ${index + 1}`}</span>
                <ul className="flex flex-wrap justify-center gap-2">
                  {nodes.map((node, nodeIndex) => (
                    <li
                      key={node}
                      className="rise-in label min-w-[7rem] border border-ink/60 bg-paper px-4 py-3 text-center"
                      style={delay(index * 220 + nodeIndex * 60)}
                    >
                      {node}
                    </li>
                  ))}
                </ul>
              </li>
            </Fragment>
          ))}
        </ol>
      </InView>
      <figcaption className="label mt-10 text-muted">Simplified request flow, top to bottom.</figcaption>
    </figure>
  );
}
