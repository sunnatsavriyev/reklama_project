import React, { useEffect, useState } from 'react';
import axios from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function AdvertisementAddPage() {
  const [formData, setFormData] = useState({
    Reklama_nomi_uz: '',
    Qurilma_turi_uz: '',
    Ijarachi_uz: '',
    Shartnoma_raqami_uz: '',
    Shartnoma_muddati_boshlanishi: '',
    Shartnoma_tugashi: '',
    O_lchov_birligi_uz: '',
    Qurilma_narxi: '',
    Egallagan_maydon: '',
    Shartnoma_summasi: '',
    contact_number: '',
    position: '',
  });

  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const navigate = useNavigate();

  // Liniyalarni olish
  useEffect(() => {
    axios.get('lines/')
      .then(res => setLines(res.data))
      .catch(err => console.error("Liniyalarni olishda xatolik", err));
  }, []);

  // Tanlangan liniyaga qarab bekatlarni olish
  useEffect(() => {
    if (selectedLine) {
      axios.get('stations/')
        .then(res => {
          const filteredStations = res.data.filter(st => st.line === selectedLine);
          setStations(filteredStations);
        })
        .catch(err => console.error("Bekatlarni olishda xatolik", err));
    } else {
      setStations([]);
    }
  }, [selectedLine]);

  // Tanlangan bekatga qarab joylarni olish
  useEffect(() => {
    if (selectedStation) {
      axios.get(`positions/?station=${selectedStation}`)
        .then(res => setPositions(res.data))
        .catch(err => console.error("Joylarni olishda xatolik", err));
    } else {
      setPositions([]);
    }
  }, [selectedStation]);

  // Input o'zgarishi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit funksiyasi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('advertisements/', formData);
      alert('Reklama muvaffaqiyatli qo‘shildi!');
      navigate('/advertisements');
    } catch (err) {
      console.error('Reklama qo‘shishda xatolik:', err.response?.data || err.message);
      alert('Xatolik yuz berdi');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Reklama Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="form-grid">

        {/* Liniya tanlash */}
        <select
          value={selectedLine}
          onChange={e => setSelectedLine(Number(e.target.value))}
          required
        >
          <option value="">Liniyani tanlang</option>
          {lines.map(line => (
            <option key={line.id} value={line.id}>{line.name_uz}</option>
          ))}
        </select>

        {/* Bekat tanlash */}
        <select
          value={selectedStation}
          onChange={e => setSelectedStation(Number(e.target.value))}
          required
        >
          <option value="">Bekatni tanlang</option>
          {stations.map(station => (
            <option key={station.id} value={station.id}>{station.name_uz}</option>
          ))}
        </select>

        {/* Joy tanlash */}
        <select
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        >
          <option value="">Joy raqamini tanlang</option>
          {positions.map(pos => (
            <option key={pos.id} value={pos.id}>Joy: {pos.number}</option>
          ))}
        </select>

        {/* Qolgan inputlar */}
        <input type="text" name="Reklama_nomi_uz" placeholder="Reklama nomi" onChange={handleChange} required />
        <input type="text" name="Qurilma_turi_uz" placeholder="Qurilma turi" onChange={handleChange} required />
        <input type="text" name="Ijarachi_uz" placeholder="Ijarachi" onChange={handleChange} required />
        <input type="text" name="Shartnoma_raqami_uz" placeholder="Shartnoma raqami" onChange={handleChange} required />
        <input type="date" name="Shartnoma_muddati_boshlanishi" onChange={handleChange} required />
        <input type="date" name="Shartnoma_tugashi" onChange={handleChange} required />
        <input type="text" name="O_lchov_birligi_uz" placeholder="O‘lchov birligi" onChange={handleChange} required />
        <input type="number" name="Qurilma_narxi" placeholder="Narx" onChange={handleChange} required />
        <input type="number" name="Egallagan_maydon" placeholder="Maydon (m²)" onChange={handleChange} required />
        <input type="number" name="Shartnoma_summasi" placeholder="Shartnoma summasi" onChange={handleChange} required />
        <input type="text" name="contact_number" placeholder="Aloqa raqami" onChange={handleChange} required />

        <button type="submit" className="form-button">Yuborish</button>
      </form>
    </div>
  );
}
