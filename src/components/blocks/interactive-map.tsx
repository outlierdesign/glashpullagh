'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Subpage options for the dropdown
const SUBPAGES = [
  { label: 'Overview', url: '/overview', thumbnail: '/images/site/hero-media.jpg' },
  { label: 'Waste Management', url: '/waste-management', thumbnail: '/images/site/carrying-equipment.jpg' },
  { label: 'Logistics and Safety', url: '/logistics-and-safety', thumbnail: '/images/site/carrying-equipment.jpg' },
  { label: 'Timber Dams', url: '/timber-dams', thumbnail: '/images/site/plank-dam.jpg' },
  { label: 'Peat Plugs', url: '/peat-plugs', thumbnail: '/images/site/peat-pool.jpg' },
  { label: 'Composite Wood Peat Dams', url: '/composite-wood-peat-dams', thumbnail: '/images/site/dam-workers.jpg' },
  { label: 'Stone Dams', url: '/stone-dams', thumbnail: '/images/site/dam-workers.jpg' },
  { label: 'Geotextiles', url: '/geotextiles', thumbnail: '/images/site/Glashapullagh Restoration West Limerick8.jpg' },
  { label: 'Removing Conifers', url: '/removing-conifers', thumbnail: '/images/site/Glashapullagh Restoration West Limerick4.jpg' },
  { label: 'Reprofiling Peat Banks', url: '/reprofiling-peat-banks', thumbnail: '/images/site/Glashapullagh Restoration West Limerick5.jpg' },
  { label: 'Coir Logs', url: '/coir-logs', thumbnail: '/images/site/monitoring-post.jpg' },
];

interface MapMarker {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  subpageIndex: number; // index into SUBPAGES
}

interface InteractiveMapProps {
  label?: string;
  title?: string;
}

const STORAGE_KEY = 'glashpullagh-map-markers';
const MAP_IMAGE_KEY = 'glashpullagh-map-image';

export default function InteractiveMap({ label = 'Location', title = 'Site Map' }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [editingMarker, setEditingMarker] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<'above' | 'below'>('above');

  // Load saved data
  useEffect(() => {
    try {
      const savedMarkers = localStorage.getItem(STORAGE_KEY);
      if (savedMarkers) setMarkers(JSON.parse(savedMarkers));
      const savedImage = localStorage.getItem(MAP_IMAGE_KEY);
      if (savedImage) setMapImage(savedImage);
    } catch (e) {
      // localStorage not available
    }
  }, []);

  // Save markers when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(markers));
    } catch (e) {}
  }, [markers]);

  // Save map image
  useEffect(() => {
    if (mapImage) {
      try {
        localStorage.setItem(MAP_IMAGE_KEY, mapImage);
      } catch (e) {}
    }
  }, [mapImage]);

  const getRelativePosition = useCallback((e: React.MouseEvent) => {
    if (!mapRef.current) return { x: 0, y: 0 };
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  }, []);

  const handleMapClick = useCallback((e: React.MouseEvent) => {
    if (!editMode || dragging) return;
    // Don't place marker if clicking on an existing marker or editing form
    if ((e.target as HTMLElement).closest('.map-marker') || (e.target as HTMLElement).closest('.marker-edit-form')) return;

    const { x, y } = getRelativePosition(e);
    const newMarker: MapMarker = {
      id: `marker-${Date.now()}`,
      x,
      y,
      title: '',
      subpageIndex: 0,
    };
    setMarkers(prev => [...prev, newMarker]);
    setEditingMarker(newMarker.id);
  }, [editMode, dragging, getRelativePosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent, markerId: string) => {
    if (!editMode) return;
    e.stopPropagation();
    e.preventDefault();
    setDragging(markerId);
  }, [editMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !mapRef.current) return;
    const { x, y } = getRelativePosition(e);
    setMarkers(prev => prev.map(m => m.id === dragging ? { ...m, x, y } : m));
  }, [dragging, getRelativePosition]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMapImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const updateMarker = useCallback((id: string, updates: Partial<MapMarker>) => {
    setMarkers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const deleteMarker = useCallback((id: string) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
    setEditingMarker(null);
  }, []);

  const handleMarkerHover = useCallback((markerId: string, e: React.MouseEvent) => {
    if (editMode) return;
    const marker = markers.find(m => m.id === markerId);
    if (!marker) return;
    // Determine if tooltip should be above or below
    setTooltipPosition(marker.y < 30 ? 'below' : 'above');
    setHoveredMarker(markerId);
  }, [editMode, markers]);

  return (
    <section className="topo-map-section">
      <div className="container">
        <div className="topo-map-container">
          <div className="topo-map-header">
            <p className="label">{label}</p>
            <h2>{title}</h2>
            <div className="divider-line divider-line-center" />
          </div>

          {/* Edit mode toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            {editMode && (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'rgba(184,134,74,0.15)',
                  border: '1px solid rgba(184,134,74,0.3)',
                  color: 'var(--gold)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.85rem',
                }}
              >
                Upload Map Image
              </button>
            )}
            <button
              onClick={() => {
                setEditMode(!editMode);
                setEditingMarker(null);
              }}
              style={{
                background: editMode ? 'var(--gold)' : 'rgba(184,134,74,0.15)',
                border: '1px solid rgba(184,134,74,0.3)',
                color: editMode ? 'var(--bg-deep)' : 'var(--gold)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                fontWeight: editMode ? 600 : 400,
              }}
            >
              {editMode ? 'Done Editing' : 'Edit Map'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          {/* Map container */}
          <div
            ref={mapRef}
            onClick={handleMapClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(184,134,74,0.15)',
              background: 'var(--bg-card)',
              cursor: editMode ? 'crosshair' : 'default',
              userSelect: 'none',
            }}
          >
            {/* Background image or placeholder */}
            {mapImage ? (
              <img
                src={mapImage}
                alt="Site map"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                }}
                draggable={false}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dim)" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p style={{
                  color: 'var(--cream-dim)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.95rem',
                }}>
                  {editMode ? 'Click "Upload Map Image" to add your site map' : 'Enable edit mode to upload a map image'}
                </p>
              </div>
            )}

            {/* Markers */}
            {markers.map((marker) => {
              const subpage = SUBPAGES[marker.subpageIndex] || SUBPAGES[0];
              const isHovered = hoveredMarker === marker.id;
              const isEditing = editingMarker === marker.id;

              return (
                <div
                  key={marker.id}
                  className="map-marker"
                  style={{
                    position: 'absolute',
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: 'translate(-50%, -100%)',
                    zIndex: isHovered || isEditing ? 50 : 10,
                  }}
                >
                  {/* Pin icon */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, marker.id)}
                    onMouseEnter={(e) => handleMarkerHover(marker.id, e)}
                    onMouseLeave={() => !editMode && setHoveredMarker(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editMode) {
                        setEditingMarker(isEditing ? null : marker.id);
                      }
                    }}
                    style={{
                      width: '32px',
                      height: '40px',
                      cursor: editMode ? 'grab' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      filter: isHovered ? 'drop-shadow(0 0 8px rgba(184,134,74,0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      transition: 'filter 0.2s ease',
                    }}
                  >
                    <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                      <path
                        d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z"
                        fill={isHovered || isEditing ? 'var(--gold)' : 'var(--gold-dim)'}
                      />
                      <circle cx="16" cy="14" r="6" fill="var(--bg-deep)" />
                    </svg>
                  </div>

                  {/* Hover tooltip (view mode) */}
                  {isHovered && !editMode && marker.title && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        ...(tooltipPosition === 'above'
                          ? { bottom: '48px' }
                          : { top: '8px' }),
                        background: 'var(--bg-deep)',
                        border: '1px solid rgba(184,134,74,0.3)',
                        borderRadius: '10px',
                        padding: '0',
                        minWidth: '220px',
                        maxWidth: '280px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        overflow: 'hidden',
                        pointerEvents: 'auto',
                      }}
                    >
                      {/* Thumbnail */}
                      <a href={subpage.url} style={{ display: 'block', textDecoration: 'none' }}>
                        <div style={{
                          width: '100%',
                          height: '120px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}>
                          <img
                            src={subpage.thumbnail}
                            alt={marker.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                          {/* Play icon overlay */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.2)',
                            transition: 'background 0.2s ease',
                          }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="white" opacity="0.8">
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          </div>
                        </div>
                        <div style={{ padding: '0.75rem 1rem' }}>
                          <h4 style={{
                            fontFamily: 'var(--font-display)',
                            color: 'var(--gold)',
                            fontSize: '0.95rem',
                            margin: 0,
                            marginBottom: '0.25rem',
                          }}>
                            {marker.title}
                          </h4>
                          <p style={{
                            fontFamily: 'var(--font-ui)',
                            color: 'var(--cream-dim)',
                            fontSize: '0.75rem',
                            margin: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            View {subpage.label} →
                          </p>
                        </div>
                      </a>
                      {/* Arrow */}
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        ...(tooltipPosition === 'above'
                          ? { bottom: '-6px', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--bg-deep)' }
                          : { top: '-6px', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid var(--bg-deep)' }),
                        width: 0,
                        height: 0,
                      }} />
                    </div>
                  )}

                  {/* Edit form (edit mode) */}
                  {isEditing && editMode && (
                    <div
                      className="marker-edit-form"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: '48px',
                        background: 'var(--bg-deep)',
                        border: '1px solid rgba(184,134,74,0.3)',
                        borderRadius: '10px',
                        padding: '1rem',
                        minWidth: '260px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        zIndex: 100,
                      }}
                    >
                      <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{
                          display: 'block',
                          fontFamily: 'var(--font-ui)',
                          color: 'var(--cream-dim)',
                          fontSize: '0.75rem',
                          marginBottom: '0.3rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>Title</label>
                        <input
                          type="text"
                          value={marker.title}
                          onChange={(e) => updateMarker(marker.id, { title: e.target.value })}
                          placeholder="e.g. Timber Dam Site A"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(184,134,74,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--cream)',
                            fontFamily: 'var(--font-ui)',
                            fontSize: '0.9rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{
                          display: 'block',
                          fontFamily: 'var(--font-ui)',
                          color: 'var(--cream-dim)',
                          fontSize: '0.75rem',
                          marginBottom: '0.3rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>Linked Page</label>
                        <select
                          value={marker.subpageIndex}
                          onChange={(e) => updateMarker(marker.id, { subpageIndex: parseInt(e.target.value) })}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(184,134,74,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--cream)',
                            fontFamily: 'var(--font-ui)',
                            fontSize: '0.9rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        >
                          {SUBPAGES.map((sp, i) => (
                            <option key={i} value={i} style={{ background: '#1a1511', color: '#EAE4DA' }}>
                              {sp.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                        <button
                          onClick={() => deleteMarker(marker.id)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(220,80,80,0.3)',
                            background: 'rgba(220,80,80,0.1)',
                            color: '#dc5050',
                            fontFamily: 'var(--font-ui)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setEditingMarker(null)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(184,134,74,0.3)',
                            background: 'rgba(184,134,74,0.15)',
                            color: 'var(--gold)',
                            fontFamily: 'var(--font-ui)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Edit mode overlay hint */}
            {editMode && mapImage && markers.length === 0 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.3)',
                pointerEvents: 'none',
              }}>
                <p style={{
                  color: 'var(--cream)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '1rem',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                }}>
                  Click anywhere on the map to place a marker
                </p>
              </div>
            )}
          </div>

          {/* Legend */}
          {markers.length > 0 && !editMode && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginTop: '1.25rem',
              justifyContent: 'center',
            }}>
              {markers.filter(m => m.title).map((marker) => {
                const subpage = SUBPAGES[marker.subpageIndex] || SUBPAGES[0];
                return (
                  <a
                    key={marker.id}
                    href={subpage.url}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      background: 'rgba(184,134,74,0.08)',
                      border: '1px solid rgba(184,134,74,0.15)',
                      textDecoration: 'none',
                      transition: 'border-color 0.2s ease, background 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(184,134,74,0.4)';
                      e.currentTarget.style.background = 'rgba(184,134,74,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(184,134,74,0.15)';
                      e.currentTarget.style.background = 'rgba(184,134,74,0.08)';
                    }}
                  >
                    <svg width="14" height="17" viewBox="0 0 32 40" fill="none">
                      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z" fill="var(--gold-dim)" />
                      <circle cx="16" cy="14" r="5" fill="var(--bg-deep)" />
                    </svg>
                    <span style={{
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--cream-dim)',
                      fontSize: '0.8rem',
                    }}>
                      {marker.title}
                    </span>
                  </a>
                );
              })}
            </div>
          )}

          {editMode && (
            <p style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontFamily: 'var(--font-ui)',
              color: 'var(--cream-dim)',
              fontSize: '0.85rem',
              opacity: 0.7,
            }}>
              Click the map to place markers • Drag markers to reposition • Click a marker to edit
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
