'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Download, RefreshCw, Copy, Check, Maximize2 } from 'lucide-react';

import { eventsApi } from '@/lib/api';

interface EventData {
  id: string;
  name: string;
  qrCode: string;
}

export default function QRCodePage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const qrRef = useRef<HTMLDivElement>(null);

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const data = await eventsApi.getEvent(eventId);
      setEvent(data);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const data = await eventsApi.regenerateQRCode(eventId);
      setEvent((prev) => prev ? { ...prev, qrCode: data.qrCode } : null);
    } catch (error) {
      console.error('Failed to regenerate QR code:', error);
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1024;
    canvas.height = 1024;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qrcode-${event?.name?.replace(/\s+/g, '-').toLowerCase() || eventId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopy = async () => {
    if (event?.qrCode) {
      await navigator.clipboard.writeText(event.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Evento não encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/events/${eventId}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Code do Evento</h1>
            <p className="text-gray-500">{event.name}</p>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div
            ref={qrRef}
            className="inline-block p-6 bg-white rounded-xl border-2 border-gray-100"
          >
            <QRCodeSVG
              value={event.qrCode}
              size={280}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <p className="mt-6 text-gray-600">
            Mostre este QR Code para os participantes fazerem check-in
          </p>

          {/* QR Code Value */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <code className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 font-mono">
              {event.qrCode.slice(0, 8)}...{event.qrCode.slice(-8)}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Copiar código"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
            >
              <Download className="w-5 h-5" />
              Baixar PNG
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              <Maximize2 className="w-5 h-5" />
              Tela Cheia
            </button>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${regenerating ? 'animate-spin' : ''}`} />
              {regenerating ? 'Gerando...' : 'Novo Código'}
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Gere um novo código se suspeitar que o atual foi comprometido.
            <br />
            Códigos antigos deixarão de funcionar imediatamente.
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Como usar</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>1. Exiba o QR Code em uma TV ou tela no local do evento</li>
            <li>2. Participantes abrem o app e vão em "Check-in por QR Code"</li>
            <li>3. Eles escaneiam o código e o check-in é feito automaticamente</li>
            <li>4. Você pode acompanhar os check-ins em tempo real no dashboard</li>
          </ul>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-white z-50 flex items-center justify-center cursor-pointer"
          onClick={toggleFullscreen}
        >
          <div className="text-center">
            <QRCodeSVG
              value={event.qrCode}
              size={Math.min(window.innerWidth, window.innerHeight) * 0.7}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
            <p className="mt-8 text-2xl font-bold text-gray-900">{event.name}</p>
            <p className="mt-2 text-gray-500">Escaneie para fazer check-in</p>
            <p className="mt-8 text-sm text-gray-400">Clique em qualquer lugar para fechar</p>
          </div>
        </div>
      )}
    </>
  );
}
