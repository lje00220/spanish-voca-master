export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface Word {
  id: string
  spanish: string
  korean: string
  pronunciation: string
  example: string
  category: string
  level: CEFRLevel
}

export const initialWords: Word[] = [
  {
    id: '1',
    spanish: 'Hola',
    korean: '안녕하세요',
    pronunciation: '올라',
    example: '¡Hola! ¿Cómo estás?',
    category: '인사',
    level: 'A1',
  },
  {
    id: '2',
    spanish: 'Gracias',
    korean: '감사합니다',
    pronunciation: '그라시아스',
    example: 'Muchas gracias por tu ayuda.',
    category: '인사',
    level: 'A1',
  },
  {
    id: '3',
    spanish: 'Por favor',
    korean: '부탁드립니다',
    pronunciation: '포르 파보르',
    example: 'Un café, por favor.',
    category: '인사',
    level: 'A1',
  },
  {
    id: '4',
    spanish: 'Buenos días',
    korean: '좋은 아침이에요',
    pronunciation: '부에노스 디아스',
    example: 'Buenos días, señor.',
    category: '인사',
    level: 'A1',
  },
  {
    id: '5',
    spanish: 'Adiós',
    korean: '안녕히 가세요',
    pronunciation: '아디오스',
    example: 'Adiós, hasta mañana.',
    category: '인사',
    level: 'A1',
  },
  {
    id: '6',
    spanish: 'Agua',
    korean: '물',
    pronunciation: '아구아',
    example: 'Necesito agua, por favor.',
    category: '음식',
    level: 'A1',
  },
  {
    id: '7',
    spanish: 'Comida',
    korean: '음식',
    pronunciation: '꼬미다',
    example: 'La comida está deliciosa.',
    category: '음식',
    level: 'A1',
  },
  {
    id: '8',
    spanish: 'Casa',
    korean: '집',
    pronunciation: '까사',
    example: 'Mi casa es tu casa.',
    category: '장소',
    level: 'A1',
  },
  {
    id: '9',
    spanish: 'Familia',
    korean: '가족',
    pronunciation: '파밀리아',
    example: 'Mi familia es muy grande.',
    category: '사람',
    level: 'A1',
  },
  {
    id: '10',
    spanish: 'Amigo',
    korean: '친구',
    pronunciation: '아미고',
    example: 'Él es mi mejor amigo.',
    category: '사람',
    level: 'A1',
  },
  {
    id: '11',
    spanish: 'Amor',
    korean: '사랑',
    pronunciation: '아모르',
    example: 'El amor es lo más importante.',
    category: '감정',
    level: 'A1',
  },
  {
    id: '12',
    spanish: 'Feliz',
    korean: '행복한',
    pronunciation: '펠리스',
    example: 'Estoy muy feliz hoy.',
    category: '감정',
    level: 'A1',
  },
  {
    id: '13',
    spanish: 'Trabajo',
    korean: '일, 직장',
    pronunciation: '뜨라바호',
    example: 'Voy al trabajo todos los días.',
    category: '일상',
    level: 'A1',
  },
  {
    id: '14',
    spanish: 'Libro',
    korean: '책',
    pronunciation: '리브로',
    example: 'Este libro es muy interesante.',
    category: '물건',
    level: 'A1',
  },
  {
    id: '15',
    spanish: 'Tiempo',
    korean: '시간, 날씨',
    pronunciation: '띠엠포',
    example: 'No tengo tiempo ahora.',
    category: '일상',
    level: 'A1',
  },
]
