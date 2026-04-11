import { useState, useRef, useCallback, useEffect } from 'react';
import type { SnapshotYear } from '../data/types';
import {
  searchCommunities,
  buildLineage,
  buildDualLineage,
  type SearchResult,
  type LineageResult,
  type DualLineageResult,
} from '../utils/lineageAlgorithm';
import type { Community } from '../data/types';
import PosterDisplay from './PosterDisplay';
import DualPosterDisplay from './DualPosterDisplay';

interface Props {
  onClose: () => void;
  currentYear: SnapshotYear;
}

const CULTURAL_COLORS: Record<string, string> = {
  Ashkenazi: '#4a9eff',
  Sephardic: '#f5a623',
  Mizrahi: '#ff8c42',
  Yemenite: '#e8c547',
  Ethiopian: '#6ecf6e',
  Mixed: '#9b8cff',
  Ancient: '#d4af37',
};

const EXAMPLE_QUERIES = ['New York', 'Warsaw', 'Morocco', 'Baghdad', 'Toledo', 'Kyiv', 'Istanbul'];

export default function LineagePoster({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [lineage, setLineage] = useState<LineageResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null!);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mixed heritage state
  const [mixedMode, setMixedMode] = useState(false);
  const [query2, setQuery2] = useState('');
  const [searchResults2, setSearchResults2] = useState<SearchResult[]>([]);
  const [selectedCommunity2, setSelectedCommunity2] = useState<Community | null>(null);
  const [dualLineage, setDualLineage] = useState<DualLineageResult | null>(null);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const debounceRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);

  // Debounced search — first input
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setSelectedCommunity(null);
    setDownloadError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const results = searchCommunities(value);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    }, 150);
  }, []);

  // Debounced search — second input (mixed mode)
  const handleQueryChange2 = useCallback((value: string) => {
    setQuery2(value);
    setSelectedCommunity2(null);
    setDownloadError('');

    if (debounceRef2.current) clearTimeout(debounceRef2.current);
    if (!value.trim()) {
      setSearchResults2([]);
      setShowDropdown2(false);
      return;
    }
    debounceRef2.current = setTimeout(() => {
      const results = searchCommunities(value);
      setSearchResults2(results);
      setShowDropdown2(results.length > 0);
    }, 150);
  }, []);

  const handleSelectCommunity = useCallback((community: Community) => {
    setSelectedCommunity(community);
    setQuery(community.name);
    setSearchResults([]);
    setShowDropdown(false);
  }, []);

  const handleSelectCommunity2 = useCallback((community: Community) => {
    setSelectedCommunity2(community);
    setQuery2(community.name);
    setSearchResults2([]);
    setShowDropdown2(false);
  }, []);

  const handleGenerate = useCallback(() => {
    if (mixedMode) {
      if (!selectedCommunity || !selectedCommunity2) return;
      const result = buildDualLineage(selectedCommunity.id, selectedCommunity2.id);
      setDualLineage(result);
      setLineage(null);
    } else {
      if (!selectedCommunity) return;
      const result = buildLineage(selectedCommunity.id);
      setLineage(result);
      setDualLineage(null);
    }
  }, [selectedCommunity, selectedCommunity2, mixedMode]);

  const handleStartOver = useCallback(() => {
    setLineage(null);
    setDualLineage(null);
    setQuery('');
    setSelectedCommunity(null);
    setSearchResults([]);
    setMixedMode(false);
    setQuery2('');
    setSelectedCommunity2(null);
    setSearchResults2([]);
    setDownloadError('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const isPosterVisible = lineage !== null || dualLineage !== null;

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    if (!lineage && !dualLineage) return;
    setIsDownloading(true);
    setDownloadError('');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const posterHeight = dualLineage ? 1200 : 1100;
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f5f0e8',
        width: 800,
        height: posterHeight,
        logging: false,
      });
      const link = document.createElement('a');
      if (dualLineage) {
        link.download = `diaspora-lineage-mixed-${dualLineage.lineage1.destination.id}-${dualLineage.lineage2.destination.id}.png`;
      } else if (lineage) {
        link.download = `diaspora-lineage-${lineage.destination.id}.png`;
      }
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      setDownloadError('Download failed. Try using your browser\'s screenshot function instead.');
    } finally {
      setIsDownloading(false);
    }
  }, [lineage, dualLineage]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-search-container]')) {
        setShowDropdown(false);
        setShowDropdown2(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const canGenerate = mixedMode
    ? selectedCommunity !== null && selectedCommunity2 !== null
    : selectedCommunity !== null;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column' }}>

      {/* ── TOP BAR ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #2a1000 0%, #0a1428 100%)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      }}>
        <button
          onClick={isPosterVisible ? handleStartOver : onClose}
          style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 8,
            padding: '7px 13px',
            color: 'white',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {isPosterVisible ? 'Start Over' : 'Back to Map'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#d4af37', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            ✡ {dualLineage ? 'Mixed Heritage' : 'Your Family Lineage'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: '0.10em' }}>
            JEWISH DIASPORA
          </div>
        </div>

        {isPosterVisible ? (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            style={{
              background: isDownloading ? 'rgba(224,123,57,0.5)' : '#e07b39',
              border: 'none',
              borderRadius: 8,
              padding: '7px 13px',
              color: 'white',
              cursor: isDownloading ? 'default' : 'pointer',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
            }}
          >
            {isDownloading ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PNG
              </>
            )}
          </button>
        ) : (
          <div style={{ width: 80 }} />
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>

        {!isPosterVisible ? (
          /* ── SEARCH VIEW ── */
          <div style={{
            maxWidth: 560,
            margin: '0 auto',
            padding: '32px 20px 40px',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#1a1410',
                lineHeight: 1.2,
                marginBottom: 10,
              }}>
                Where are your roots?
              </div>
              <div style={{ fontSize: 15, color: '#9a8a7a', lineHeight: 1.55, maxWidth: 400, margin: '0 auto' }}>
                Enter your city or country and we&apos;ll trace how Jews arrived there — from ancient origins to the present day.
              </div>
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => setMixedMode(false)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  background: !mixedMode ? '#e07b39' : 'rgba(0,0,0,0.08)',
                  color: !mixedMode ? '#fff' : '#5a4a3a',
                }}
              >Single Lineage</button>
              <button
                onClick={() => setMixedMode(true)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  background: mixedMode ? '#e07b39' : 'rgba(0,0,0,0.08)',
                  color: mixedMode ? '#fff' : '#5a4a3a',
                }}
              >Mixed Heritage</button>
            </div>

            {/* First search box */}
            <div style={{ marginBottom: 6 }}>
              {mixedMode && (
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9a8a7a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                  First Background
                </div>
              )}
              <div data-search-container="" style={{ position: 'relative', marginBottom: 12 }}>
                <div style={{
                  position: 'relative',
                  background: 'white',
                  borderRadius: 12,
                  border: '1.5px solid rgba(0,0,0,0.10)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'visible',
                }}>
                  <div style={{ padding: '0 14px', color: '#9a8a7a', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="e.g. New York, Poland, Morocco, Baghdad…"
                    value={query}
                    onChange={e => handleQueryChange(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: 15,
                      padding: '14px 14px 14px 0',
                      background: 'transparent',
                      color: '#1a1410',
                      fontFamily: 'inherit',
                    }}
                    autoFocus
                  />
                  {query && (
                    <button
                      onClick={() => handleQueryChange('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9a8a7a',
                        padding: '0 14px',
                        fontSize: 18,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Dropdown results */}
                {showDropdown && searchResults.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.10)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 200,
                    overflow: 'hidden',
                  }}>
                    {searchResults.map((result, i) => (
                      <button
                        key={result.community.id}
                        onClick={() => handleSelectCommunity(result.community)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '11px 16px',
                          background: 'none',
                          border: 'none',
                          borderBottom: i < searchResults.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f5f0e8')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <span style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: CULTURAL_COLORS[result.community.culturalType] ?? '#9a8a7a',
                          flexShrink: 0,
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1410' }}>
                            {result.community.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#9a8a7a', marginTop: 1 }}>
                            {result.community.culturalType} community
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c5b9ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* No results hint */}
              {query.length >= 2 && searchResults.length === 0 && !showDropdown && (
                <div style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#9a8a7a',
                  padding: '8px 0 4px',
                }}>
                  No communities found. Try a country name like &ldquo;Poland&rdquo; or &ldquo;Morocco&rdquo;.
                </div>
              )}

              {/* Selected community confirmation */}
              {selectedCommunity && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'white',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 12,
                  border: '1.5px solid rgba(0,0,0,0.08)',
                }}>
                  <span style={{
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: CULTURAL_COLORS[selectedCommunity.culturalType] ?? '#9a8a7a',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1410' }}>{selectedCommunity.name}</div>
                    <div style={{ fontSize: 11, color: '#9a8a7a' }}>{selectedCommunity.culturalType} tradition</div>
                  </div>
                  <span style={{ color: '#4caf50', fontSize: 16 }}>✓</span>
                </div>
              )}
            </div>

            {/* Second search box (mixed mode only) */}
            {mixedMode && (
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9a8a7a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Second Background
                </div>
                <div data-search-container="" style={{ position: 'relative', marginBottom: 12 }}>
                  <div style={{
                    position: 'relative',
                    background: 'white',
                    borderRadius: 12,
                    border: '1.5px solid rgba(0,0,0,0.10)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'visible',
                  }}>
                    <div style={{ padding: '0 14px', color: '#9a8a7a', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    </div>
                    <input
                      ref={inputRef2}
                      type="text"
                      placeholder="e.g. Toledo, Istanbul, Baghdad…"
                      value={query2}
                      onChange={e => handleQueryChange2(e.target.value)}
                      onFocus={() => searchResults2.length > 0 && setShowDropdown2(true)}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: 15,
                        padding: '14px 14px 14px 0',
                        background: 'transparent',
                        color: '#1a1410',
                        fontFamily: 'inherit',
                      }}
                    />
                    {query2 && (
                      <button
                        onClick={() => handleQueryChange2('')}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#9a8a7a',
                          padding: '0 14px',
                          fontSize: 18,
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Dropdown results 2 */}
                  {showDropdown2 && searchResults2.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      right: 0,
                      background: 'white',
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.10)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      zIndex: 200,
                      overflow: 'hidden',
                    }}>
                      {searchResults2.map((result, i) => (
                        <button
                          key={result.community.id}
                          onClick={() => handleSelectCommunity2(result.community)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '11px 16px',
                            background: 'none',
                            border: 'none',
                            borderBottom: i < searchResults2.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f5f0e8')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <span style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: CULTURAL_COLORS[result.community.culturalType] ?? '#9a8a7a',
                            flexShrink: 0,
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1410' }}>
                              {result.community.name}
                            </div>
                            <div style={{ fontSize: 11, color: '#9a8a7a', marginTop: 1 }}>
                              {result.community.culturalType} community
                            </div>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c5b9ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* No results hint 2 */}
                {query2.length >= 2 && searchResults2.length === 0 && !showDropdown2 && (
                  <div style={{
                    textAlign: 'center',
                    fontSize: 13,
                    color: '#9a8a7a',
                    padding: '8px 0 4px',
                  }}>
                    No communities found. Try a country name like &ldquo;Spain&rdquo; or &ldquo;Baghdad&rdquo;.
                  </div>
                )}

                {/* Selected community 2 confirmation */}
                {selectedCommunity2 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'white',
                    borderRadius: 10,
                    padding: '10px 14px',
                    marginBottom: 12,
                    border: '1.5px solid rgba(0,0,0,0.08)',
                  }}>
                    <span style={{
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: CULTURAL_COLORS[selectedCommunity2.culturalType] ?? '#9a8a7a',
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1410' }}>{selectedCommunity2.name}</div>
                      <div style={{ fontSize: 11, color: '#9a8a7a' }}>{selectedCommunity2.culturalType} tradition</div>
                    </div>
                    <span style={{ color: '#4caf50', fontSize: 16 }}>✓</span>
                  </div>
                )}
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: canGenerate ? '#e07b39' : 'rgba(0,0,0,0.10)',
                color: canGenerate ? 'white' : '#9a8a7a',
                fontSize: 15,
                fontWeight: 700,
                cursor: canGenerate ? 'pointer' : 'default',
                letterSpacing: '0.02em',
                transition: 'background 0.15s, transform 0.1s',
              }}
              onMouseEnter={e => { if (canGenerate) (e.currentTarget as HTMLButtonElement).style.background = '#c9692a'; }}
              onMouseLeave={e => { if (canGenerate) (e.currentTarget as HTMLButtonElement).style.background = '#e07b39'; }}
            >
              {mixedMode ? 'Generate Mixed Heritage Poster' : 'Generate My Lineage Poster'}
            </button>

            {/* Example queries */}
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#b0a090', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8 }}>
                Try these
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {EXAMPLE_QUERIES.map(ex => (
                  <button
                    key={ex}
                    onClick={() => {
                      handleQueryChange(ex);
                      setTimeout(() => {
                        const results = searchCommunities(ex);
                        if (results.length > 0) {
                          handleSelectCommunity(results[0].community);
                        }
                      }, 200);
                    }}
                    style={{
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: 20,
                      padding: '5px 13px',
                      fontSize: 12,
                      color: '#5a4a3a',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#ede8e0')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 28, textAlign: 'center', fontSize: 11, color: '#c0b0a0', lineHeight: 1.55 }}>
              Data based on 62 documented communities &amp; 62 historical migrations
              <br />spanning 3,800 years. Some lineages may be simplified.
            </div>
          </div>
        ) : (
          /* ── POSTER VIEW ── */
          <div style={{ padding: '16px 12px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {downloadError && (
              <div style={{
                maxWidth: 560,
                width: '100%',
                marginBottom: 12,
                padding: '10px 14px',
                background: '#fff3f0',
                border: '1px solid #ffccb8',
                borderRadius: 8,
                fontSize: 13,
                color: '#c0392b',
              }}>
                {downloadError}
              </div>
            )}

            <div style={{
              maxWidth: 560,
              width: '100%',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              <div style={{ fontSize: 13, color: '#9a8a7a' }}>
                {dualLineage ? 'Your mixed heritage poster is ready' : 'Your poster is ready'}
              </div>
              <div style={{ fontSize: 11, color: '#b0a090' }}>
                Or use your browser&apos;s screenshot/print function
              </div>
            </div>

            {dualLineage ? (
              <DualPosterDisplay lineage={dualLineage} posterRef={posterRef} />
            ) : lineage ? (
              <PosterDisplay lineage={lineage} posterRef={posterRef} />
            ) : null}
          </div>
        )}
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
