import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosInstance';

export default function EditAdvertisementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  const [positions, setPositions] = useState([]);
  const [showExport, setShowExport] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    axios.get(`advertisements/${id}/`)
      .then(res => {
        const data = res.data;
        setFormData({
          ...data,
          position: data.position?.id || data.position,
          position_data: data.position_data || null // fallback uchun
        });
      })
      .catch(err => console.error('Xatolik:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSave = () => {
    const data = new FormData();

    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (key === 'position_data') continue;
        data.append(key, formData[key]);
      }
    }

    axios.put(`advertisements/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => {
        alert('Ma’lumotlar muvaffaqiyatli saqlandi');
        navigate('/');
      })
      .catch(err => {
        console.error('Tahrirlashda xatolik:', err.response?.data || err);
        alert('Xatolik yuz berdi');
      });
  };

  const fetchPositions = () => {
    if (!formData?.position) return alert("Position aniqlanmadi");

    axios.get(`positions/${formData.position}/`)
      .then(res => {
        const stationId = res.data.station;
        if (!stationId) {
          alert('Stansiya aniqlanmadi');
          return;
        }

        axios.get('positions/')
          .then(res2 => {
            const filtered = res2.data.filter(p => p.station === stationId);
            setPositions(filtered);
            setShowExport(true);
          })
          .catch(err => {
            console.error('Positionlarni olishda xatolik:', err);
            alert('Positionlarni olishda xatolik');
          });

      })
      .catch(err => {
        console.error('Positionni olishda xatolik:', err);
        alert('Position aniqlanmadi');
      });
  };

  const handleExport = () => {
    if (!selectedPosition) return alert('Iltimos, joy tanlang!');
    axios.post(`advertisements/${id}/export/`, {
      position: parseInt(selectedPosition)
    })
      .then(res => {
        alert(res.data.detail || 'Export muvaffaqiyatli');
        navigate('/');
      })
      .catch(err => {
        console.error('Exportda xatolik:', err.response?.data || err);
        alert('Export xatoligi');
      });
  };

  if (!formData) return <p>Yuklanmoqda...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reklamani tahrirlash</h2>

      {[
        'Reklama_nomi_uz', 'Shartnoma_raqami_uz', 'Ijarachi_uz', 'Shartnoma_muddati_boshlanishi',
        'Shartnoma_tugashi', 'O_lchov_birligi_uz', 'Qurilma_turi_uz', 'Qurilma_narxi',
        'Egallagan_maydon', 'Shartnoma_summasi', 'contact_number'
      ].map(field => (
        <input
          key={field}
          name={field}
          value={formData[field] || ''}
          onChange={handleChange}
          placeholder={field.replace(/_/g, ' ')}
          style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
        />
      ))}

      <label>📷 Rasm (photo):</label>
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: '10px' }}
      />
      {formData.photo && typeof formData.photo === 'string' && (
        <p>
          <a href={formData.photo} target="_blank" rel="noopener noreferrer">Rasmni ko‘rish</a>
        </p>
      )}

      <label>📄 Shartnoma fayl:</label>
      <input
        type="file"
        name="Shartnoma_fayl"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        style={{ marginBottom: '10px' }}
      />
      {formData.Shartnoma_fayl && typeof formData.Shartnoma_fayl === 'string' && (
        <p>
          <a href={formData.Shartnoma_fayl} target="_blank" rel="noopener noreferrer">Faylni ko‘rish</a>
        </p>
      )}

      <button
        onClick={handleSave}
        style={{ marginRight: '10px', background: '#28a745', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '5px' }}
      >
        💾 Saqlash
      </button>

      <button
        onClick={fetchPositions}
        style={{ background: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '5px' }}
      >
        📤 Export (joy tanlash)
      </button>

      {showExport && (
        <div style={{ marginTop: '20px' }}>
          <label><b>Ko‘chirish uchun yangi joyni tanlang:</b></label>
          <select
            value={selectedPosition || ''}
            onChange={e => setSelectedPosition(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            <option value="">-- Joy tanlang --</option>
            {positions.map(pos => (
              <option key={pos.id} value={pos.id}>
                Joy ID: {pos.id} — {pos.name || `Position ${pos.id}`}
              </option>
            ))}
          </select>

          <button
            onClick={handleExport}
            style={{ background: '#17a2b8', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '5px' }}
          >
            🚀 Ko‘chirishni boshlash
          </button>
        </div>
      )}
    </div>
  );
}
