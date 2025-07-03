import React, { useEffect, useState } from 'react';
import axios from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function AdvertisementAddPage() {
  const [language, setLanguage] = useState('uz');
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [formData, setFormData] = useState({
    Reklama_nomi_uz: '',
    Reklama_nomi_ru: '',
    Qurilma_turi_uz: '',
    Qurilma_turi_ru: '',
    Ijarachi_uz: '',
    Ijarachi_ru: '',
    Shartnoma_raqami_uz: '',
    Shartnoma_raqami_ru: '',
    Shartnoma_muddati_boshlanishi: '',
    Shartnoma_tugashi: '',
    O_lchov_birligi_uz: '',
    O_lchov_birligi_ru: '',
    Qurilma_narxi: '',
    Egallagan_maydon: '',
    Shartnoma_summasi: '',
    contact_number: '',
    position: '',
    photo: null,
    Shartnoma_fayl: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('lines/')
      .then(res => setLines(res.data))
      .catch(err => console.error('Liniyalarni olishda xatolik', err));
  }, []);

  useEffect(() => {
    if (selectedLine) {
      axios.get(`stations/?line=${selectedLine}`)
        .then(res => setStations(res.data))
        .catch(err => console.error('Bekatlarni olishda xatolik', err));
    } else {
      setStations([]);
    }
  }, [selectedLine]);

  useEffect(() => {
    if (selectedStation) {
      axios.get(`positions/?station=${selectedStation}`)
        .then(res => setPositions(res.data))
        .catch(err => console.error('Joylarni olishda xatolik', err));
    } else {
      setPositions([]);
    }
  }, [selectedStation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        data.append(key, value);
      }
    });

    try {
      await axios.post('advertisements/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Reklama muvaffaqiyatli qo‘shildi');
      navigate('/database');
    } catch (err) {
      console.error('Xatolik:', err.response?.data || err.message);
      alert('❌ Xatolik yuz berdi');
    }
  };

  const t = {
    uz: {
      title: 'Reklama Qo‘shish',
      line: 'Liniya tanlang',
      station: 'Bekat tanlang',
      position: 'Joy tanlang',
      reklamaNomi: 'Reklama nomi (UZ)',
      reklamaNomiRu: 'Reklama nomi (RU)',
      qurilmaTuri: 'Qurilma turi (UZ)',
      qurilmaTuriRu: 'Qurilma turi (RU)',
      ijarachi: 'Ijarachi (UZ)',
      ijarachiRu: 'Ijarachi (RU)',
      shartnomaRaqami: 'Shartnoma raqami (UZ)',
      shartnomaRaqamiRu: 'Shartnoma raqami (RU)',
      boshlanish: 'Boshlanish sanasi',
      tugash: 'Tugash sanasi',
      olchov: 'O‘lchov birligi (UZ)',
      olchovRu: 'O‘lchov birligi (RU)',
      narx: 'Narx',
      maydon: 'Maydon',
      summa: 'Shartnoma summasi',
      tel: 'Aloqa raqami',
      file: 'Shartnoma fayli',
      photo: 'Rasm',
      submit: '✅ Yuborish'
    },
    ru: {
      title: 'Добавить рекламу',
      line: 'Выберите линию',
      station: 'Выберите станцию',
      position: 'Выберите место',
      reklamaNomi: 'Название рекламы (UZ)',
      reklamaNomiRu: 'Название рекламы (RU)',
      qurilmaTuri: 'Тип устройства (UZ)',
      qurilmaTuriRu: 'Тип устройства (RU)',
      ijarachi: 'Арендатор (UZ)',
      ijarachiRu: 'Арендатор (RU)',
      shartnomaRaqami: 'Номер договора (UZ)',
      shartnomaRaqamiRu: 'Номер договора (RU)',
      boshlanish: 'Дата начала',
      tugash: 'Дата окончания',
      olchov: 'Единица измерения (UZ)',
      olchovRu: 'Единица измерения (RU)',
      narx: 'Цена',
      maydon: 'Площадь',
      summa: 'Сумма договора',
      tel: 'Номер телефона',
      file: 'Файл договора',
      photo: 'Фото',
      submit: '✅ Отправить'
    }
  };

  return (
    <div className="form-container">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 className="form-title">{t[language].title}</h2>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="uz">UZ</option>
          <option value="ru">RU</option>
        </select>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>

        <select value={selectedLine} onChange={e => setSelectedLine(Number(e.target.value))} required>
          <option value="">{t[language].line}</option>
          {lines.map(line => (
            <option key={line.id} value={line.id}>{line.name_uz}</option>
          ))}
        </select>

        <select value={selectedStation} onChange={e => setSelectedStation(Number(e.target.value))} required>
          <option value="">{t[language].station}</option>
          {stations.map(station => (
            <option key={station.id} value={station.id}>{station.name_uz}</option>
          ))}
        </select>

        <select name="position" value={formData.position} onChange={handleChange} required>
          <option value="">{t[language].position}</option>
          {positions.filter(p => !p.advertisement).map(p => (
            <option key={p.id} value={p.id}>Joy #{p.number}</option>
          ))}
        </select>

        <input type="text" name="Reklama_nomi_uz" placeholder={t[language].reklamaNomi} onChange={handleChange} required />
        <input type="text" name="Reklama_nomi_ru" placeholder={t[language].reklamaNomiRu} onChange={handleChange} required />
        <input type="text" name="Qurilma_turi_uz" placeholder={t[language].qurilmaTuri} onChange={handleChange} required />
        <input type="text" name="Qurilma_turi_ru" placeholder={t[language].qurilmaTuriRu} onChange={handleChange} required />
        <input type="text" name="Ijarachi_uz" placeholder={t[language].ijarachi} onChange={handleChange} required />
        <input type="text" name="Ijarachi_ru" placeholder={t[language].ijarachiRu} onChange={handleChange} required />
        <input type="text" name="Shartnoma_raqami_uz" placeholder={t[language].shartnomaRaqami} onChange={handleChange} required />
        <input type="text" name="Shartnoma_raqami_ru" placeholder={t[language].shartnomaRaqamiRu} onChange={handleChange} required />
        <input type="date" name="Shartnoma_muddati_boshlanishi" onChange={handleChange} required />
        <input type="date" name="Shartnoma_tugashi" onChange={handleChange} required />

        <label>{t[language].olchov}</label>
        <select name="O_lchov_birligi_uz" value={formData.O_lchov_birligi_uz} onChange={handleChange} required>
          <option value="">-- {t[language].olchov} --</option>
          <option value="dona">Dona</option>
          <option value="kv_metr">Kv metr</option>
          <option value="komplekt">Komplekt</option>
        </select>

        <label>{t[language].olchovRu}</label>
        <select name="O_lchov_birligi_ru" value={formData.O_lchov_birligi_ru} onChange={handleChange} required>
          <option value="">-- {t[language].olchovRu} --</option>
          <option value="штука">Штука</option>
          <option value="кв. метр">Кв. метр</option>
          <option value="комплект">Комплект</option>
        </select>

        <input type="number" name="Qurilma_narxi" placeholder={t[language].narx} onChange={handleChange} required />
        <input type="number" name="Egallagan_maydon" placeholder={t[language].maydon} onChange={handleChange} required />
        <input type="number" name="Shartnoma_summasi" placeholder={t[language].summa} onChange={handleChange} required />
        <input type="text" name="contact_number" placeholder={t[language].tel} onChange={handleChange} required />

        <label>{t[language].file}</label>
        <input type="file" name="Shartnoma_fayl" onChange={handleFileChange} />
        <small className="help-text">PDF yoki DOC fayl. Maksimal 5MB.</small>

        <label>{t[language].photo}</label>
        <input type="file" name="photo" onChange={handleFileChange} required />
        <small className="help-text">JPG yoki PNG rasm. Maksimal 3MB.</small>

        <button type="submit" className="form-button">{t[language].submit}</button>
      </form>
    </div>
  );
}
