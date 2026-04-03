/**
 * CEFR A1 단어 데이터셋 생성 스크립트
 *
 * 출처: Wiktionary Spanish Frequency List (공개 데이터)
 * 번역: Lingva Translate API
 *
 * 사용법: npx tsx scripts/generate-cefr-words.ts
 */

interface RawWord {
  spanish: string
  category: string
}

// Wiktionary 빈출 리스트 기반 A1 수준 단어
const A1_WORDS: RawWord[] = [
  // 인사 / 기본표현
  { spanish: 'hola', category: '인사' },
  { spanish: 'gracias', category: '인사' },
  { spanish: 'por favor', category: '인사' },
  { spanish: 'buenos días', category: '인사' },
  { spanish: 'buenas tardes', category: '인사' },
  { spanish: 'buenas noches', category: '인사' },
  { spanish: 'adiós', category: '인사' },
  { spanish: 'perdón', category: '인사' },

  // 동사
  { spanish: 'ser', category: '동사' },
  { spanish: 'estar', category: '동사' },
  { spanish: 'tener', category: '동사' },
  { spanish: 'hacer', category: '동사' },
  { spanish: 'ir', category: '동사' },
  { spanish: 'poder', category: '동사' },
  { spanish: 'querer', category: '동사' },
  { spanish: 'saber', category: '동사' },
  { spanish: 'decir', category: '동사' },
  { spanish: 'ver', category: '동사' },
  { spanish: 'dar', category: '동사' },
  { spanish: 'hablar', category: '동사' },
  { spanish: 'comer', category: '동사' },
  { spanish: 'beber', category: '동사' },
  { spanish: 'vivir', category: '동사' },
  { spanish: 'dormir', category: '동사' },
  { spanish: 'escribir', category: '동사' },
  { spanish: 'leer', category: '동사' },
  { spanish: 'escuchar', category: '동사' },
  { spanish: 'comprar', category: '동사' },
  { spanish: 'estudiar', category: '동사' },
  { spanish: 'trabajar', category: '동사' },
  { spanish: 'llamar', category: '동사' },
  { spanish: 'salir', category: '동사' },
  { spanish: 'llegar', category: '동사' },
  { spanish: 'pagar', category: '동사' },
  { spanish: 'esperar', category: '동사' },
  { spanish: 'entender', category: '동사' },
  { spanish: 'necesitar', category: '동사' },
  { spanish: 'gustar', category: '동사' },
  { spanish: 'conocer', category: '동사' },
  { spanish: 'venir', category: '동사' },
  { spanish: 'creer', category: '동사' },
  { spanish: 'pensar', category: '동사' },
  { spanish: 'sentir', category: '동사' },
  { spanish: 'pasar', category: '동사' },
  { spanish: 'abrir', category: '동사' },
  { spanish: 'cerrar', category: '동사' },
  { spanish: 'correr', category: '동사' },
  { spanish: 'caminar', category: '동사' },
  { spanish: 'cocinar', category: '동사' },
  { spanish: 'jugar', category: '동사' },
  { spanish: 'cantar', category: '동사' },
  { spanish: 'bailar', category: '동사' },
  { spanish: 'nadar', category: '동사' },
  { spanish: 'ayudar', category: '동사' },
  { spanish: 'preguntar', category: '동사' },

  // 명사 - 사람/가족
  { spanish: 'hombre', category: '사람' },
  { spanish: 'mujer', category: '사람' },
  { spanish: 'niño', category: '사람' },
  { spanish: 'niña', category: '사람' },
  { spanish: 'amigo', category: '사람' },
  { spanish: 'padre', category: '가족' },
  { spanish: 'madre', category: '가족' },
  { spanish: 'hermano', category: '가족' },
  { spanish: 'hermana', category: '가족' },
  { spanish: 'hijo', category: '가족' },
  { spanish: 'hija', category: '가족' },
  { spanish: 'familia', category: '가족' },

  // 명사 - 장소
  { spanish: 'casa', category: '장소' },
  { spanish: 'ciudad', category: '장소' },
  { spanish: 'país', category: '장소' },
  { spanish: 'calle', category: '장소' },
  { spanish: 'escuela', category: '장소' },
  { spanish: 'hospital', category: '장소' },
  { spanish: 'tienda', category: '장소' },
  { spanish: 'restaurante', category: '장소' },
  { spanish: 'parque', category: '장소' },
  { spanish: 'supermercado', category: '장소' },
  { spanish: 'banco', category: '장소' },
  { spanish: 'iglesia', category: '장소' },
  { spanish: 'playa', category: '장소' },
  { spanish: 'hotel', category: '장소' },
  { spanish: 'aeropuerto', category: '장소' },
  { spanish: 'estación', category: '장소' },
  { spanish: 'oficina', category: '장소' },
  { spanish: 'baño', category: '장소' },
  { spanish: 'cocina', category: '장소' },

  // 명사 - 음식
  { spanish: 'agua', category: '음식' },
  { spanish: 'comida', category: '음식' },
  { spanish: 'pan', category: '음식' },
  { spanish: 'leche', category: '음식' },
  { spanish: 'café', category: '음식' },
  { spanish: 'cerveza', category: '음식' },
  { spanish: 'carne', category: '음식' },
  { spanish: 'pollo', category: '음식' },
  { spanish: 'pescado', category: '음식' },
  { spanish: 'fruta', category: '음식' },
  { spanish: 'verdura', category: '음식' },
  { spanish: 'arroz', category: '음식' },
  { spanish: 'huevo', category: '음식' },

  // 명사 - 시간
  { spanish: 'tiempo', category: '시간' },
  { spanish: 'día', category: '시간' },
  { spanish: 'noche', category: '시간' },
  { spanish: 'mañana', category: '시간' },
  { spanish: 'tarde', category: '시간' },
  { spanish: 'hora', category: '시간' },
  { spanish: 'minuto', category: '시간' },
  { spanish: 'semana', category: '시간' },
  { spanish: 'mes', category: '시간' },
  { spanish: 'año', category: '시간' },

  // 명사 - 요일
  { spanish: 'lunes', category: '요일' },
  { spanish: 'martes', category: '요일' },
  { spanish: 'miércoles', category: '요일' },
  { spanish: 'jueves', category: '요일' },
  { spanish: 'viernes', category: '요일' },
  { spanish: 'sábado', category: '요일' },
  { spanish: 'domingo', category: '요일' },

  // 명사 - 물건/일상
  { spanish: 'libro', category: '물건' },
  { spanish: 'teléfono', category: '물건' },
  { spanish: 'mesa', category: '물건' },
  { spanish: 'silla', category: '물건' },
  { spanish: 'puerta', category: '물건' },
  { spanish: 'ventana', category: '물건' },
  { spanish: 'ropa', category: '물건' },
  { spanish: 'zapato', category: '물건' },
  { spanish: 'cama', category: '물건' },
  { spanish: 'coche', category: '교통' },

  // 명사 - 기타
  { spanish: 'dinero', category: '일상' },
  { spanish: 'trabajo', category: '일상' },
  { spanish: 'vida', category: '일상' },
  { spanish: 'nombre', category: '일상' },
  { spanish: 'cosa', category: '일상' },
  { spanish: 'lugar', category: '일상' },
  { spanish: 'mundo', category: '일상' },
  { spanish: 'problema', category: '일상' },
  { spanish: 'idea', category: '일상' },
  { spanish: 'amor', category: '감정' },

  // 명사 - 사람/직업
  { spanish: 'médico', category: '직업' },
  { spanish: 'profesor', category: '직업' },
  { spanish: 'estudiante', category: '직업' },

  // 명사 - 동물
  { spanish: 'perro', category: '동물' },
  { spanish: 'gato', category: '동물' },

  // 명사 - 신체
  { spanish: 'cabeza', category: '신체' },
  { spanish: 'mano', category: '신체' },
  { spanish: 'ojo', category: '신체' },
  { spanish: 'boca', category: '신체' },
  { spanish: 'pie', category: '신체' },
  { spanish: 'corazón', category: '신체' },

  // 숫자
  { spanish: 'uno', category: '숫자' },
  { spanish: 'dos', category: '숫자' },
  { spanish: 'tres', category: '숫자' },
  { spanish: 'cuatro', category: '숫자' },
  { spanish: 'cinco', category: '숫자' },
  { spanish: 'seis', category: '숫자' },
  { spanish: 'siete', category: '숫자' },
  { spanish: 'ocho', category: '숫자' },
  { spanish: 'nueve', category: '숫자' },
  { spanish: 'diez', category: '숫자' },
  { spanish: 'cien', category: '숫자' },

  // 형용사
  { spanish: 'bueno', category: '형용사' },
  { spanish: 'malo', category: '형용사' },
  { spanish: 'grande', category: '형용사' },
  { spanish: 'pequeño', category: '형용사' },
  { spanish: 'nuevo', category: '형용사' },
  { spanish: 'viejo', category: '형용사' },
  { spanish: 'bonito', category: '형용사' },
  { spanish: 'feo', category: '형용사' },
  { spanish: 'caliente', category: '형용사' },
  { spanish: 'frío', category: '형용사' },
  { spanish: 'rápido', category: '형용사' },
  { spanish: 'lento', category: '형용사' },
  { spanish: 'fácil', category: '형용사' },
  { spanish: 'difícil', category: '형용사' },
  { spanish: 'feliz', category: '감정' },
  { spanish: 'triste', category: '감정' },
  { spanish: 'cansado', category: '감정' },
  { spanish: 'enfermo', category: '감정' },
  { spanish: 'contento', category: '감정' },

  // 색깔
  { spanish: 'rojo', category: '색깔' },
  { spanish: 'azul', category: '색깔' },
  { spanish: 'verde', category: '색깔' },
  { spanish: 'blanco', category: '색깔' },
  { spanish: 'negro', category: '색깔' },
  { spanish: 'amarillo', category: '색깔' },
]

// Lingva Translate API로 번역
async function translateWord(spanish: string): Promise<string> {
  const url = `https://lingva.ml/api/v1/es/ko/${encodeURIComponent(spanish)}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Translation failed for "${spanish}": HTTP ${res.status}`)
  }

  const data = await res.json()

  if (data.translation) {
    return data.translation
  }

  throw new Error(`Translation failed for "${spanish}": no translation field`)
}

// rate limit 준수를 위한 딜레이
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  console.log(`총 ${A1_WORDS.length}개 단어 번역 시작...\n`)

  const results = []
  let failed = 0

  for (let i = 0; i < A1_WORDS.length; i++) {
    const word = A1_WORDS[i]

    try {
      const korean = await translateWord(word.spanish)
      results.push({
        id: String(i + 1),
        spanish: word.spanish.charAt(0).toUpperCase() + word.spanish.slice(1),
        korean,
        pronunciation: '',
        example: '',
        category: word.category,
        level: 'A1' as const,
      })

      console.log(`[${i + 1}/${A1_WORDS.length}] ${word.spanish} → ${korean}`)
    } catch (e) {
      console.error(`[${i + 1}/${A1_WORDS.length}] FAILED: ${word.spanish} - ${e}`)
      failed++
      // 실패해도 빈 번역으로 추가
      results.push({
        id: String(i + 1),
        spanish: word.spanish.charAt(0).toUpperCase() + word.spanish.slice(1),
        korean: '(번역 실패 - 수동 입력 필요)',
        pronunciation: '',
        example: '',
        category: word.category,
        level: 'A1' as const,
      })
    }

    // rate limit 준수: 요청 간 1초 대기
    if (i < A1_WORDS.length - 1) {
      await delay(1000)
    }
  }

  const outputPath = new URL('../src/data/cefr-words.json', import.meta.url)
  const fs = await import('fs')
  fs.writeFileSync(outputPath.pathname, JSON.stringify(results, null, 2), 'utf-8')

  console.log(`\n완료! ${results.length}개 단어 저장됨 (실패: ${failed}개)`)
  console.log(`→ src/data/cefr-words.json`)
  console.log(`\n⚠️  pronunciation, example 필드는 비어 있습니다.`)
  console.log(`   Wiktionary API 연동(Commit 6) 후 채울 예정입니다.`)
  if (failed > 0) {
    console.log(`\n⚠️  번역 실패 ${failed}개는 "(번역 실패 - 수동 입력 필요)"로 표시됨`)
  }
}

main()
