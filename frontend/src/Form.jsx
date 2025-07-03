import React, { useState, useEffect } from 'react';
import axios from './axiosInstance';

export default function AdvertisementForm() {
  const [form, setForm] = useState({
    Reklama_nomi_uz: '',
    Reklama_nomi_ru: '',
    Qurilma_turi_uz: '',
    Qurilma_turi_ru: '',
    Shartnoma_muddati_boshlanishi: '',
    Shartnoma_tugashi: '',
    Qurilma_narxi: '',
    Egallagan_maydon: '',
    Shartnoma_summasi: '',
    contact_number: '+998',
    position: '',
    O_lchov_birligi_uz: '',
    O_lchov_birligi_ru: ''
  });

  const [photo, setPhoto] = useState(null);
  const [contractFile, setContractFile] = useState(null);
  const [ads, setAds] = useState([]);

  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [positions, setPositions] = useState([]);

  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  useEffect(() => {
    axios.get('advertisements/')
      .then(res => setAds(res.data))
      .catch(err => console.error('Maʼlumotlarni olishda xatolik:', err));
  }, []);

  useEffect(() => {
    axios.get('lines/')
      .then(res => setLines(res.data))
      .catch(err => console.error('Liniyalarni olishda xatolik:', err));
  }, []);

  useEffect(() => {
    if (selectedLine) {
      axios.get('stations/')
        .then(res => {
          const filtered = res.data.filter(st => st.line === selectedLine);
          setStations(filtered);
        })
        .catch(err => console.error("Bekatlarni olishda xatolik", err));
    }
  }, [selectedLine]);

  useEffect(() => {
    if (selectedStation) {
      axios.get(`positions/?station=${selectedStation}`)
        .then(res => setPositions(res.data))
        .catch(err => console.error("Joylarni olishda xatolik", err));
    }
  }, [selectedStation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleContractChange = (e) => {
    setContractFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== '') data.append(key, value);
    });

    if (photo) data.append('photo', photo);
    if (contractFile) data.append('Shartnoma_fayl', contractFile);

    try {
      await axios.post('advertisements/', data);
      alert('✅ Reklama muvaffaqiyatli qo‘shildi');

      setForm({
        Reklama_nomi_uz: '',
        Reklama_nomi_ru: '',
        Qurilma_turi_uz: '',
        Qurilma_turi_ru: '',
        Shartnoma_muddati_boshlanishi: '',
        Shartnoma_tugashi: '',
        Qurilma_narxi: '',
        Egallagan_maydon: '',
        Shartnoma_summasi: '',
        contact_number: '+998',
        position: '',
        O_lchov_birligi_uz: '',
        O_lchov_birligi_ru: ''
      });
      setPhoto(null);
      setContractFile(null);

      const res = await axios.get('advertisements/');
      setAds(res.data);
    } catch (err) {
      alert('❌ Xatolik yuz berdi');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Reklama Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="form-grid">

        <select onChange={e => setSelectedLine(Number(e.target.value))} required>
          <option value="">Liniyani tanlang</option>
          {lines.map(line => (
            <option key={line.id} value={line.id}>{line.name_uz}</option>
          ))}
        </select>

        <select onChange={e => setSelectedStation(Number(e.target.value))} required>
          <option value="">Bekatni tanlang</option>
          {stations.map(st => (
            <option key={st.id} value={st.id}>{st.name_uz}</option>
          ))}
        </select>

        <select name="position" value={form.position} onChange={handleChange} required>
          <option value="">Joy raqamini tanlang</option>
          {positions.map(pos => (
            <option key={pos.id} value={pos.id}>Joy: {pos.number}</option>
          ))}
        </select>

        <input name="Reklama_nomi_uz" placeholder="Reklama nomi (uz)" value={form.Reklama_nomi_uz} onChange={handleChange} required />
        <input name="Reklama_nomi_ru" placeholder="Reklama nomi (ru)" value={form.Reklama_nomi_ru} onChange={handleChange} />
        <input name="Qurilma_turi_uz" placeholder="Qurilma turi (uz)" value={form.Qurilma_turi_uz} onChange={handleChange} />
        <input name="Qurilma_turi_ru" placeholder="Qurilma turi (ru)" value={form.Qurilma_turi_ru} onChange={handleChange} />
        <input type="date" name="Shartnoma_muddati_boshlanishi" value={form.Shartnoma_muddati_boshlanishi} onChange={handleChange} required />
        <input type="date" name="Shartnoma_tugashi" value={form.Shartnoma_tugashi} onChange={handleChange} required />
        <input type="number" name="Qurilma_narxi" placeholder="Narx" value={form.Qurilma_narxi} onChange={handleChange} />
        <input type="number" name="Egallagan_maydon" placeholder="Maydon (m²)" value={form.Egallagan_maydon} onChange={handleChange} />
        <input type="number" name="Shartnoma_summasi" placeholder="Shartnoma summasi" value={form.Shartnoma_summasi} onChange={handleChange} />
        <input name="contact_number" placeholder="Aloqa raqami" value={form.contact_number} onChange={handleChange} />

        <label>O‘lchov birligi:</label>                   
        <select name="O_lchov_birligi_uz" value={form.O_lchov_birligi_uz} onChange={handleChange} required>
          <option value="">O‘lchov birligini tanlang (uz)</option>
          <option value="dona">Dona</option>
          <option value="kv_metr">Kv metr</option>
          <option value="komplekt">Komplekt</option>
        </select>

        <select name="O_lchov_birligi_ru" value={form.O_lchov_birligi_ru} onChange={handleChange} required>
          <option value="">O‘lchov birligini tanlang (ru)</option>
          <option value="штука">Штука</option>
          <option value="кв. метр">Кв. метр</option>
          <option value="комплект">Комплект</option>
        </select>

        <label>Shartnoma fayl:</label>
        <input type="file" onChange={handleContractChange} />
        <label>Rasm yuklang:</label>
        <input type="file" onChange={handlePhotoChange} />

        <button type="submit">Yuborish</button>
      </form>
    </div>
  );
}
