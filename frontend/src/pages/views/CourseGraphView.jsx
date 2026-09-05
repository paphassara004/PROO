import { useEffect, useMemo, useRef, useState } from 'react';

const CG_COLUMNS = [
  { key: 'y1s1', label: 'ปี 1 / ภาค 1' }, { key: 'y1s2', label: 'ปี 1 / ภาค 2' },
  { key: 'y2s1', label: 'ปี 2 / ภาค 1' }, { key: 'y2s2', label: 'ปี 2 / ภาค 2' },
  { key: 'y3s1', label: 'ปี 3 / ภาค 1' }, { key: 'y3s2', label: 'ปี 3 / ภาค 2' },
  { key: 'y4s1', label: 'ปี 4 / ภาค 1' }, { key: 'y4s2', label: 'ปี 4 / ภาค 2' },
];
const CG_NODES = [
  { code: 'SC-001-013', col: 'y1s1', track: null }, { code: 'SC-112-101', col: 'y1s1', track: null }, { code: 'SC-112-102', col: 'y1s1', track: null },
  { code: 'SC-001-014', col: 'y1s2', track: null }, { code: 'SC-112-103', col: 'y1s2', track: null }, { code: 'SC-112-104', col: 'y1s2', track: null }, { code: 'SC-112-105', col: 'y1s2', track: null },
  { code: 'SC-001-015', col: 'y2s1', track: null }, { code: 'SC-112-201', col: 'y2s1', track: null }, { code: 'SC-112-202', col: 'y2s1', track: null }, { code: 'SC-112-203', col: 'y2s1', track: null },
  { code: 'SC-112-204', col: 'y2s2', track: null }, { code: 'SC-112-205', col: 'y2s2', track: null }, { code: 'SC-112-206', col: 'y2s2', track: null }, { code: 'SC-112-207', col: 'y2s2', track: null }, { code: 'SC-112-208', col: 'y2s2', track: null },
  { code: 'SC-113-301', col: 'y3s1', track: 'a' }, { code: 'SC-113-302', col: 'y3s1', track: 'a' }, { code: 'SC-113-303', col: 'y3s1', track: 'a' }, { code: 'SC-113-304', col: 'y3s1', track: 'a' },
  { code: 'SC-113-305', col: 'y3s2', track: 'a' }, { code: 'SC-113-306', col: 'y3s2', track: 'a' }, { code: 'SC-113-307', col: 'y3s2', track: 'a' }, { code: 'SC-113-308', col: 'y3s2', track: 'a' },
  { code: 'SC-113-309', col: 'y3s1', track: 'b' }, { code: 'SC-113-310', col: 'y3s1', track: 'b' }, { code: 'SC-113-311', col: 'y3s1', track: 'b' }, { code: 'SC-113-312', col: 'y3s1', track: 'b' },
  { code: 'SC-113-313', col: 'y3s2', track: 'b' }, { code: 'SC-113-314', col: 'y3s2', track: 'b' }, { code: 'SC-113-315', col: 'y3s2', track: 'b' }, { code: 'SC-113-316', col: 'y3s2', track: 'b' },
  { code: 'SC-115-301', col: 'y3s2', track: null },
  { code: 'SC-112-401', col: 'y4s1', track: null }, { code: 'SC-115-401', col: 'y4s1', track: null },
  { code: 'SC-112-402', col: 'y4s2', track: null }, { code: 'SC-115-402', col: 'y4s2', track: null },
];

export default function CourseGraphView({ data, onBack }) {
  const [track, setTrack] = useState('a');
  const [highlighted, setHighlighted] = useState(null);
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const nodeRefs = useRef({});

  const courseLookup = useMemo(() => Object.fromEntries(data.courses.map((c) => [c.code, c])), [data.courses]);
  const edges = data.prereqs || [];

  const visibleNodes = useMemo(
    () => CG_NODES.filter((n) => n.track === null || n.track === track),
    [track]
  );
  const visibleCodes = useMemo(() => new Set(visibleNodes.map((n) => n.code)), [visibleNodes]);

  function drawEdges() {
    const svg = svgRef.current, wrap = wrapRef.current;
    if (!svg || !wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    svg.setAttribute('width', wrap.scrollWidth);
    svg.setAttribute('height', wrap.scrollHeight);
    svg.innerHTML = '';
    const colorMap = { hard: 'var(--teal)', weak: 'var(--circuit)', co: 'var(--pulse)' };
    const dashMap = { hard: 'none', weak: '5,4', co: '1,4' };

    edges.forEach((edge) => {
      const { from_code: from, to_code: to, type } = edge;
      if (!visibleCodes.has(from) || !visibleCodes.has(to)) return;
      const fromEl = nodeRefs.current[from], toEl = nodeRefs.current[to];
      if (!fromEl || !toEl) return;
      const fr = fromEl.getBoundingClientRect(), tr = toEl.getBoundingClientRect();
      const x1 = fr.right - wrapRect.left + wrap.scrollLeft, y1 = fr.top + fr.height / 2 - wrapRect.top + wrap.scrollTop;
      const x2 = tr.left - wrapRect.left + wrap.scrollLeft, y2 = tr.top + tr.height / 2 - wrapRect.top + wrap.scrollTop;
      const midX = (x1 + x2) / 2;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', colorMap[type]);
      path.setAttribute('stroke-width', type === 'hard' ? '2' : '1.5');
      path.setAttribute('stroke-dasharray', dashMap[type]);
      const involved = highlighted && (from === highlighted || to === highlighted);
      path.setAttribute('opacity', highlighted ? (involved ? '0.9' : '0.08') : '0.55');
      if (involved) path.setAttribute('stroke-width', type === 'hard' ? '3' : '2.5');
      svg.appendChild(path);
    });
  }

  useEffect(() => {
    const raf = requestAnimationFrame(drawEdges);
    const onResize = () => drawEdges();
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, highlighted, edges.length]);

  const connectedCodes = useMemo(() => {
    if (!highlighted) return null;
    const set = new Set([highlighted]);
    edges.forEach((e) => {
      if (e.from_code === highlighted) set.add(e.to_code);
      if (e.to_code === highlighted) set.add(e.from_code);
    });
    return set;
  }, [highlighted, edges]);

  return (
    <section className="pub-section">
      <div className="container">
        <button className="view-back" onClick={() => onBack('hub')}>← กลับไปหน้าสำรวจหลักสูตร</button>
      </div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">หลักสูตร</div>
          <h2>กราฟรายวิชา</h2>
          
        </div>
        <div className="toolbar" style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <button className={`track-btn-pub${track === 'a' ? ' active' : ''}`} onClick={() => { setTrack('a'); setHighlighted(null); }}>แขนง A · วิทยาการข้อมูลและ AI ทางการแพทย์</button>
          <button className={`track-btn-pub${track === 'b' ? ' active' : ''}`} onClick={() => { setTrack('b'); setHighlighted(null); }}>แขนง B · เทคโนโลยีสารสนเทศทางการแพทย์</button>
        </div>
        <div className="cg-legend">
          <span><i className="cg-swatch cg-hard" /> Hard prerequisite — ต้องเรียนผ่านก่อน</span>
          <span><i className="cg-swatch cg-weak" /> Weak / แนะนำให้เรียนก่อน</span>
          <span><i className="cg-swatch cg-co" /> Co-requisite — เรียนพร้อมกันได้</span>
        </div>
        <div
          className="cg-wrap"
          ref={wrapRef}
          onClick={(e) => { if (!e.target.closest('.cg-node')) setHighlighted(null); }}
        >
          <svg ref={svgRef} className="cg-svg" />
          <div className="cg-columns">
            {CG_COLUMNS.map((col) => (
              <div className="cg-col" key={col.key}>
                <div className="cg-col-head">{col.label}</div>
                {visibleNodes.filter((n) => n.col === col.key).map((n) => {
                  const c = courseLookup[n.code];
                  if (!c) return null;
                  const dim = connectedCodes && !connectedCodes.has(n.code);
                  const hi = connectedCodes && connectedCodes.has(n.code) && n.code !== highlighted;
                  return (
                    <div
                      key={n.code}
                      ref={(el) => { nodeRefs.current[n.code] = el; }}
                      className={`cg-node${dim ? ' dim' : ''}${hi ? ' hi' : ''}`}
                      onClick={() => setHighlighted(highlighted === n.code ? null : n.code)}
                    >
                      <span className="code">{n.code}</span>
                      <span className="name">{c.th_name}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="cg-hint">คลิกที่รายวิชาเพื่อไฮไลต์เส้นทางที่เกี่ยวข้อง</p>
      </div>
    </section>
  );
}
