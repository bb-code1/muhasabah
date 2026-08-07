import React from 'react';
import Link from 'next/link';
import { morningEveningAzkaar } from '@/features/religious/data/azkaar';
import { ArrowLeft, BookOpen, Sun, Moon } from 'lucide-react';

export default function MorningEveningAzkaarPage() {
  return (
    <div style={{ padding: '0 24px 60px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link
          href="/religious"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--c-surface-container-high)',
            color: 'var(--c-on-surface)',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sun size={20} color="var(--c-primary)" />
            <Moon size={20} color="var(--c-primary)" />
            <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 800, color: 'var(--c-on-surface)' }}>
              Morning & Evening Azkaar
            </h1>
          </div>
          <p className="text-body-md text-on-surface-variant" style={{ margin: 0, marginTop: '4px' }}>
            Authentic daily supplications from Hisnul Muslim (Citadel of the Muslim)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {morningEveningAzkaar.map((azkaar, index) => (
          <div key={azkaar.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
            {/* Number Badge */}
            <div style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              backgroundColor: 'var(--c-primary)', 
              color: 'white', 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '12px', 
              fontWeight: 700 
            }}>
              {index + 1}
            </div>

            {/* Title */}
            {azkaar.title && (
              <h3 className="text-title-md" style={{ margin: 0, paddingRight: '36px', fontWeight: 700, color: 'var(--c-on-surface)' }}>
                {azkaar.title}
              </h3>
            )}

            {/* Arabic */}
            <p className="arabic-text" style={{ 
              margin: 0, 
              fontSize: '28px', 
              color: 'var(--c-primary)',
              fontWeight: 700 
            }}>
              {azkaar.arabic}
            </p>

            {/* Transliteration */}
            <p className="text-body-md" style={{ margin: 0, fontStyle: 'italic', color: 'var(--c-on-surface-variant)' }}>
              {azkaar.transliteration}
            </p>

            {/* Translation */}
            <p className="text-body-md" style={{ margin: 0, color: 'var(--c-on-surface)' }}>
              <span style={{ fontWeight: 600 }}>Translation:</span> {azkaar.translation}
            </p>

            <div style={{ height: '1px', backgroundColor: 'var(--c-outline-variant)', margin: '4px 0' }} />

            {/* Benefit & Reference */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {azkaar.benefit && (
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px', color: 'var(--c-secondary)', fontSize: '14px' }}>
                  <BookOpen size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><span style={{ fontWeight: 600 }}>Benefit:</span> {azkaar.benefit}</span>
                </div>
              )}
              <div style={{ fontSize: '13px', color: 'var(--c-on-surface-variant)' }}>
                <span style={{ fontWeight: 600 }}>Reference:</span> {azkaar.reference || 'Hisnul Muslim'}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
