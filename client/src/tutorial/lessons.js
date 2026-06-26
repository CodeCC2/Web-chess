/**
 * บทเรียนเปิดเกมหมากรุก — สอนแนวทางเปิดยอดนิยมทีละตา (10 ตาฝั่งขาว)
 */

export const lessons = [
  {
    "id": "ruy-lopez",
    "title": "Ruy Lopez",
    "subtitle": "Spanish Opening",
    "icon": "🇪🇸",
    "eco": "C88",
    "description": "เปิดสเปน — กดดันม้า c6 ควบคุมศูนย์กลาง และเตรียมรุกคิงอย่างปลอดภัย สายหลัก Morphy Defense",
    "line": "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d6 9.h3 Bb7 10.d4",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. e4",
        "instruction": "เปิดด้วย e4 — ครองศูนย์กลางและเปิดทางให้บิชอปกับควีน",
        "expected": {
          "from": "e2",
          "to": "e4"
        },
        "hint": "King's Pawn ที่นิยมที่สุด",
        "opponentMove": {
          "from": "e7",
          "to": "e5"
        },
        "opponentSan": "1...e5"
      },
      {
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "san": "2. Nf3",
        "instruction": "พัฒนาม้า f3 — โจมตี e5 และเตรียม castling",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "hint": "อย่าเดินเบี้ยซ้ำก่อนพัฒนาหมากหลัก",
        "opponentMove": {
          "from": "b8",
          "to": "c6"
        },
        "opponentSan": "2...Nc6"
      },
      {
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "san": "3. Bb5",
        "instruction": "Ruy Lopez! บิชอป b5 กดดันม้า c6 ที่ปกป้อง e5",
        "expected": {
          "from": "f1",
          "to": "b5"
        },
        "hint": "คู่ต่อสู่อาจเสียจังหวะหากม้าถูกไล่",
        "opponentMove": {
          "from": "a7",
          "to": "a6"
        },
        "opponentSan": "3...a6"
      },
      {
        "fen": "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
        "san": "4. Ba4",
        "instruction": "ถอย Ba4 (Morphy Defense) — รักษาความกดดันบนม้า c6",
        "expected": {
          "from": "b5",
          "to": "a4"
        },
        "hint": "อย่ารีบกินม้า c6 ทันที",
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "4...Nf6"
      },
      {
        "fen": "r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 5",
        "san": "5. O-O",
        "instruction": "Castling สั้น — นำคิงไปที่ปลอดภัย",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "hint": "คลิกคิง e1 แล้วคลิก g1",
        "opponentMove": {
          "from": "f8",
          "to": "e7"
        },
        "opponentSan": "5...Be7"
      },
      {
        "fen": "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 6",
        "san": "6. Re1",
        "instruction": "เรือ e1 ชี้ e5 — เตรียมกดดันเบี้ยกลางและรองรับ e4",
        "expected": {
          "from": "f1",
          "to": "e1"
        },
        "hint": "แผน Closed Ruy Lopez คลาสสิก",
        "opponentMove": {
          "from": "b7",
          "to": "b5"
        },
        "opponentSan": "6...b5"
      },
      {
        "fen": "r1bqk2r/2ppbppp/p1n2n2/1p2p3/B3P3/5N2/PPPP1PPP/RNBQR1K1 w kq - 0 7",
        "san": "7. Bb3",
        "instruction": "ถอยบิชอปมา b3 — หลีกเลี่ยง ...b5xb4 และรักษาบิชอปคม",
        "expected": {
          "from": "a4",
          "to": "b3"
        },
        "hint": "บิชอปยังชี้ f7 ทางแนวทแยง",
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "7...O-O"
      },
      {
        "fen": "r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w - - 2 8",
        "san": "8. c3",
        "instruction": "c3 เตรียมผลัก d4 — ขยายศูนย์กลางและเปิดทางบิชอป c1",
        "expected": {
          "from": "c2",
          "to": "c3"
        },
        "hint": "แผน Zaitsev/Chigorin มักเริ่มจากโครงสร้างนี้",
        "opponentMove": {
          "from": "d7",
          "to": "d6"
        },
        "opponentSan": "8...d6"
      },
      {
        "fen": "r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 0 9",
        "san": "9. h3",
        "instruction": "h3 ป้องกันม้าไป g4 ไล่บิชอป — เตรียมพื้นที่ให้คิงปลอดภัย",
        "expected": {
          "from": "h2",
          "to": "h3"
        },
        "hint": "Prophylaxis — ป้องกันก่อนถูกรบกวน",
        "opponentMove": {
          "from": "c8",
          "to": "b7"
        },
        "opponentSan": "9...Bb7"
      },
      {
        "fen": "r2q1rk1/1bp1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 w - - 1 10",
        "san": "10. d4",
        "instruction": "ผลัก d4! ท้าทายศูนย์กลาง — จุดเปลี่ยนสู่กลางเกม",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "hint": "หากกิน d4 จะเปิดคอลัมน์ e ให้เรือ"
      }
    ]
  },
  {
    "id": "queens-gambit-declined",
    "title": "Queen's Gambit",
    "subtitle": "Declined (QGD)",
    "icon": "♕",
    "eco": "D37",
    "description": "Queen's Gambit Declined — ต่อสู้เพื่อศูนย์กลางด้วย d4 และ c4 พัฒนาหมากอย่างมั่นคง",
    "line": "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 Nbd7 7.Bd3 c5 8.cxd5 exd5 9.Ne5 Nxe5 10.Qh5",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. d4",
        "instruction": "เปิด d4 — ควบคุม e5 และ c5",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "hint": "Queen's Pawn opening",
        "opponentMove": {
          "from": "d7",
          "to": "d5"
        },
        "opponentSan": "1...d5"
      },
      {
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "san": "2. c4",
        "instruction": "Queen's Gambit — เสนอเบี้ยเพื่อแย่งศูนย์กลาง",
        "expected": {
          "from": "c2",
          "to": "c4"
        },
        "hint": "เป้าหมายคือพื้นที่ ไม่ใช่กินเบี้ย",
        "opponentMove": {
          "from": "e7",
          "to": "e6"
        },
        "opponentSan": "2...e6"
      },
      {
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "san": "3. Nc3",
        "instruction": "พัฒนาม้า c3 — รองรับ d4 และเตรียม e4",
        "expected": {
          "from": "b1",
          "to": "c3"
        },
        "hint": "Development ก่อนโจมตี",
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "3...Nf6"
      },
      {
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
        "san": "4. Bg5",
        "instruction": "บิชอป g5 กดดันม้า f6 — ลดศักยภาพคู่ต่อสู้",
        "expected": {
          "from": "c1",
          "to": "g5"
        },
        "hint": "อาจทำให้คู่ต่อสู่เสียจังหวะ castling",
        "opponentMove": {
          "from": "f8",
          "to": "e7"
        },
        "opponentSan": "4...Be7"
      },
      {
        "fen": "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq - 4 5",
        "san": "5. e3",
        "instruction": "e3 สร้างฐานมั่นคง — รองรับ d4 และพัฒนาบิชอป",
        "expected": {
          "from": "e2",
          "to": "e3"
        },
        "hint": "แนว Orthodox QGD",
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "5...O-O"
      },
      {
        "fen": "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR w KQ - 1 6",
        "san": "6. Nf3",
        "instruction": "พัฒนาม้า f3 — เตรียม castling และควบคุม e5",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "hint": "หมากหลักครบก่อนโจมตี",
        "opponentMove": {
          "from": "b8",
          "to": "d7"
        },
        "opponentSan": "6...Nbd7"
      },
      {
        "fen": "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 3 7",
        "san": "7. Bd3",
        "instruction": "บิชอป d3 ชี้ h7 — เตรียมโจมตีฝั่งคิง",
        "expected": {
          "from": "f1",
          "to": "d3"
        },
        "hint": "บิชอปคู่ชี้คิงคู่ต่อสู้",
        "opponentMove": {
          "from": "c7",
          "to": "c5"
        },
        "opponentSan": "7...c5"
      },
      {
        "fen": "r1bq1rk1/pp1nbppp/4pn2/2pp2B1/2PP4/2NBPN2/PP3PPP/R2QK2R w KQ - 0 8",
        "san": "8. cxd5",
        "instruction": "กิน d5 — เปิดคอลัมน์ c และลดความอัดแน่น",
        "expected": {
          "from": "c4",
          "to": "d5"
        },
        "hint": "หลังแลก ม้า c3 มีทางไป d5 หรือ b5",
        "opponentMove": {
          "from": "e6",
          "to": "d5"
        },
        "opponentSan": "8...exd5"
      },
      {
        "fen": "r1bq1rk1/pp1nbppp/5n2/2pp2B1/3P4/2NBPN2/PP3PPP/R2QK2R w KQ - 0 9",
        "san": "9. Ne5",
        "instruction": "ม้า e5 ตั้งแต่เขมือน — โจมตี f7 และม้า c6",
        "expected": {
          "from": "f3",
          "to": "e5"
        },
        "hint": "Tactical central outpost",
        "opponentMove": {
          "from": "d7",
          "to": "e5"
        },
        "opponentSan": "9...Nxe5"
      },
      {
        "fen": "r1bq1rk1/pp2bppp/5n2/2ppn1B1/3P4/2NBP3/PP3PPP/R2QK2R w KQ - 0 10",
        "san": "10. Qh5",
        "instruction": "ควีน h5 คุกคาม f7 — สร้างภัยคู่กับม้า e5",
        "expected": {
          "from": "d1",
          "to": "h5"
        },
        "hint": "กดดันฝั่งคิงคู่ต่อสู้"
      }
    ]
  },
  {
    "id": "queens-gambit-accepted",
    "title": "Queen's Gambit",
    "subtitle": "Accepted (QGA)",
    "icon": "♛",
    "eco": "D20",
    "description": "Queen's Gambit Accepted — ตอบรับเบี้ย c แล้วพัฒนาเร็วกว่าเพื่อแย่งคืนพื้นที่กลาง",
    "line": "1.d4 d5 2.c4 dxc4 3.e4 Nf6 4.Bxc4 e6 5.Nf3 Bb4+ 6.Bd2 Bxd2+ 7.Qxd2 O-O 8.e5 Nd5 9.Ng5 Nc6 10.Bxd5",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. d4",
        "instruction": "เปิด d4 — ควบคุมศูนย์กลาง",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "opponentMove": {
          "from": "d7",
          "to": "d5"
        },
        "opponentSan": "1...d5"
      },
      {
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "san": "2. c4",
        "instruction": "Queen's Gambit — ท้าให้คู่ต่อสู่ตัดสินใจ",
        "expected": {
          "from": "c2",
          "to": "c4"
        },
        "opponentMove": {
          "from": "d5",
          "to": "c4"
        },
        "opponentSan": "2...dxc4"
      },
      {
        "fen": "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "san": "3. e4",
        "instruction": "e4! สร้างเบี้ยคู่กลางแข็งแกร่ง — พัฒนาเร็วกว่ากินเบี้ย",
        "expected": {
          "from": "e2",
          "to": "e4"
        },
        "hint": "Main line QGA",
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "3...Nf6"
      },
      {
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/2pPP3/8/PP3PPP/RNBQKBNR w KQkq - 1 4",
        "san": "4. Bxc4",
        "instruction": "กินเบี้ยคืน — พัฒนาบิชอปพร้อมกู้พื้นที่กลาง",
        "expected": {
          "from": "f1",
          "to": "c4"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e6"
        },
        "opponentSan": "4...e6"
      },
      {
        "fen": "rnbqkb1r/ppp2ppp/4pn2/8/2BPP3/8/PP3PPP/RNBQK1NR w KQkq - 0 5",
        "san": "5. Nf3",
        "instruction": "พัฒนาม้า f3 — เตรียม castling",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "f8",
          "to": "b4"
        },
        "opponentSan": "5...Bb4+"
      },
      {
        "fen": "rnbqk2r/ppp2ppp/4pn2/8/1bBPP3/5N2/PP3PPP/RNBQK2R w KQkq - 2 6",
        "san": "6. Bd2",
        "instruction": "ตอบรุก Bb4+ — รักษาบิชอปคู่",
        "expected": {
          "from": "c1",
          "to": "d2"
        },
        "hint": "ดีกว่า Nc3 ที่ให้คู่ต่อสู่แลกม้า",
        "opponentMove": {
          "from": "b4",
          "to": "d2"
        },
        "opponentSan": "6...Bxd2+"
      },
      {
        "fen": "rnbqk2r/ppp2ppp/4pn2/8/2BPP3/5N2/PP1b1PPP/RN1QK2R w KQkq - 0 7",
        "san": "7. Qxd2",
        "instruction": "กินบิชอปคืน — ควีนมาตั้งศูนย์กลางพร้อมรองรับ e4",
        "expected": {
          "from": "d1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "7...O-O"
      },
      {
        "fen": "rnbq1rk1/ppp2ppp/4pn2/8/2BPP3/5N2/PP1Q1PPP/RN2K2R w KQ - 1 8",
        "san": "8. e5",
        "instruction": "ผลัก e5 ไล่ม้า — ขยายพื้นที่กลาง",
        "expected": {
          "from": "e4",
          "to": "e5"
        },
        "hint": "ได้เปรียบพื้นที่",
        "opponentMove": {
          "from": "f6",
          "to": "d5"
        },
        "opponentSan": "8...Nd5"
      },
      {
        "fen": "rnbq1rk1/ppp2ppp/4p3/3nP3/2BP4/5N2/PP1Q1PPP/RN2K2R w KQ - 1 9",
        "san": "9. Ng5",
        "instruction": "ม้า g5 คุกคาม f7 — สร้างภัยทันที",
        "expected": {
          "from": "f3",
          "to": "g5"
        },
        "hint": "Tactical motif ใน QGA",
        "opponentMove": {
          "from": "b8",
          "to": "c6"
        },
        "opponentSan": "9...Nc6"
      },
      {
        "fen": "r1bq1rk1/ppp2ppp/2n1p3/3nP1N1/2BP4/8/PP1Q1PPP/RN2K2R w KQ - 3 10",
        "san": "10. Bxd5",
        "instruction": "กินม้า d5 — ทำลายหมากกลางคู่ต่อสู้",
        "expected": {
          "from": "c4",
          "to": "d5"
        },
        "hint": "ได้เปรียบโครงสร้างหลังแลก",
        "opponentMove": {
          "from": "e6",
          "to": "d5"
        },
        "opponentSan": "10...exd5"
      }
    ]
  },
  {
    "id": "italian-game",
    "title": "Italian Game",
    "subtitle": "Giuoco Piano",
    "icon": "🇮🇹",
    "eco": "C50",
    "description": "Italian Game — พัฒนาบิชอปเร็ว ชี้ f7 และผลัก d4 ท้าทายศูนย์กลาง",
    "line": "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.O-O",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. e4",
        "instruction": "เปิด e4 — ครองศูนย์กลาง",
        "expected": {
          "from": "e2",
          "to": "e4"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e5"
        },
        "opponentSan": "1...e5"
      },
      {
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "san": "2. Nf3",
        "instruction": "พัฒนาม้าและโจมตี e5",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "b8",
          "to": "c6"
        },
        "opponentSan": "2...Nc6"
      },
      {
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "san": "3. Bc4",
        "instruction": "Italian Game! บิชอป c4 ชี้จุดอ่อน f7",
        "expected": {
          "from": "f1",
          "to": "c4"
        },
        "hint": "ต่างจาก Bb5 ของ Ruy Lopez",
        "opponentMove": {
          "from": "f8",
          "to": "c5"
        },
        "opponentSan": "3...Bc5"
      },
      {
        "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        "san": "4. c3",
        "instruction": "c3 เตรียมผลัก d4 — แผน Giuoco Piano",
        "expected": {
          "from": "c2",
          "to": "c3"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "4...Nf6"
      },
      {
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5",
        "san": "5. d4",
        "instruction": "ผลัก d4! ท้าทายศูนย์กลาง",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "hint": "หัวใจของ Italian Game",
        "opponentMove": {
          "from": "e5",
          "to": "d4"
        },
        "opponentSan": "5...exd4"
      },
      {
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2R w KQkq - 0 6",
        "san": "6. cxd4",
        "instruction": "กินเบี้ยคืน — เปิดคอลัมน์ c",
        "expected": {
          "from": "c3",
          "to": "d4"
        },
        "opponentMove": {
          "from": "c5",
          "to": "b4"
        },
        "opponentSan": "6...Bb4+"
      },
      {
        "fen": "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP3PPP/RNBQK2R w KQkq - 1 7",
        "san": "7. Bd2",
        "instruction": "ตอบรุก Bb4+ — รักษาหมาก",
        "expected": {
          "from": "c1",
          "to": "d2"
        },
        "hint": "ไม่ให้บิชอปถูกแลกฟรี",
        "opponentMove": {
          "from": "b4",
          "to": "d2"
        },
        "opponentSan": "7...Bxd2+"
      },
      {
        "fen": "r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1b1PPP/RN1QK2R w KQkq - 0 8",
        "san": "8. Nbxd2",
        "instruction": "กินบิชอปคืนด้วยม้า — พัฒนาหมากต่อเนื่อง",
        "expected": {
          "from": "b1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "d7",
          "to": "d5"
        },
        "opponentSan": "8...d5"
      },
      {
        "fen": "r1bqk2r/ppp2ppp/2n2n2/3p4/2BPP3/5N2/PP1N1PPP/R2QK2R w KQkq - 0 9",
        "san": "9. exd5",
        "instruction": "กิน d5 — เปิดเส้นบิชอปและลดความอัดแน่น",
        "expected": {
          "from": "e4",
          "to": "d5"
        },
        "hint": "หลังแลก ศูนย์กลางเปิดขึ้น",
        "opponentMove": {
          "from": "f6",
          "to": "d5"
        },
        "opponentSan": "9...Nxd5"
      },
      {
        "fen": "r1bqk2r/ppp2ppp/2n5/3n4/2BP4/5N2/PP1N1PPP/R2QK2R w KQkq - 0 10",
        "san": "10. O-O",
        "instruction": "Castling — คิงปลอดภัยก่อนเริ่มกลางเกม",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "hint": "แผนต่อไป: Bb3 หรือ Re1"
      }
    ]
  },
  {
    "id": "london-system",
    "title": "London System",
    "subtitle": "Solid Setup",
    "icon": "🏰",
    "eco": "D02",
    "description": "London System — แผนเปิดที่เรียนง่าย ใช้รูปแบบเดิมได้เกือบทุกเกม",
    "line": "1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 Bd6 5.Bg3 O-O 6.Nbd2 Nbd7 7.c3 c5 8.Bd3 Qc7 9.O-O cxd4 10.cxd4",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. d4",
        "instruction": "เปิด d4 — จุดเริ่ม London System",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "opponentMove": {
          "from": "d7",
          "to": "d5"
        },
        "opponentSan": "1...d5"
      },
      {
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "san": "2. Bf4",
        "instruction": "Bf4 ก่อน e3 — หัวใจของ London!",
        "expected": {
          "from": "c1",
          "to": "f4"
        },
        "hint": "ต้องออกบิชอปก่อน e3 บัง",
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "2...Nf6"
      },
      {
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 2 3",
        "san": "3. e3",
        "instruction": "e3 รองรับ d4 — โครงสร้างมั่นคง",
        "expected": {
          "from": "e2",
          "to": "e3"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e6"
        },
        "opponentSan": "3...e6"
      },
      {
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 0 4",
        "san": "4. Nf3",
        "instruction": "พัฒนาม้า f3 — เตรียม castling",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "f8",
          "to": "d6"
        },
        "opponentSan": "4...Bd6"
      },
      {
        "fen": "rnbqk2r/ppp2ppp/3bpn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 2 5",
        "san": "5. Bg3",
        "instruction": "ถอย Bg3 — รักษาบิชอปคมไว้",
        "expected": {
          "from": "f4",
          "to": "g3"
        },
        "hint": "London ไม่แลกบิชอปง่ายๆ",
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "5...O-O"
      },
      {
        "fen": "rnbq1rk1/ppp2ppp/3bpn2/3p4/3P4/4PNB1/PPP2PPP/RN1QKB1R w KQ - 4 6",
        "san": "6. Nbd2",
        "instruction": "พัฒนาม้าคู่ — รองรับ e4 หรือ c4 ในอนาคต",
        "expected": {
          "from": "b1",
          "to": "d2"
        },
        "hint": "แผน London มาตรฐาน",
        "opponentMove": {
          "from": "b8",
          "to": "d7"
        },
        "opponentSan": "6...Nbd7"
      },
      {
        "fen": "r1bq1rk1/pppn1ppp/3bpn2/3p4/3P4/4PNB1/PPPN1PPP/R2QKB1R w KQ - 6 7",
        "san": "7. c3",
        "instruction": "c3 รองรับ d4 — เตรียมรับ ...c5",
        "expected": {
          "from": "c2",
          "to": "c3"
        },
        "opponentMove": {
          "from": "c7",
          "to": "c5"
        },
        "opponentSan": "7...c5"
      },
      {
        "fen": "r1bq1rk1/pp1n1ppp/3bpn2/2pp4/3P4/2P1PNB1/PP1N1PPP/R2QKB1R w KQ - 0 8",
        "san": "8. Bd3",
        "instruction": "บิชอป d3 ชี้ h7 — เตรียมโจมตีฝั่งคิง",
        "expected": {
          "from": "f1",
          "to": "d3"
        },
        "hint": "บิชอปคู่ใน London",
        "opponentMove": {
          "from": "d8",
          "to": "c7"
        },
        "opponentSan": "8...Qc7"
      },
      {
        "fen": "r1b2rk1/ppqn1ppp/3bpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2QK2R w KQ - 2 9",
        "san": "9. O-O",
        "instruction": "Castling — คิงปลอดภัย เรือเชื่อมเข้าเกม",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "opponentMove": {
          "from": "c5",
          "to": "d4"
        },
        "opponentSan": "9...cxd4"
      },
      {
        "fen": "r1b2rk1/ppqn1ppp/3bpn2/3p4/3p4/2PBPNB1/PP1N1PPP/R2Q1RK1 w - - 0 10",
        "san": "10. cxd4",
        "instruction": "กิน c4 — เปิดคอลัมน์ c สำหรับเรือ",
        "expected": {
          "from": "c3",
          "to": "d4"
        },
        "hint": "ได้เปรียบโครงสร้างหลังแลก"
      }
    ]
  },
  {
    "id": "sicilian-defense",
    "title": "Sicilian Defense",
    "subtitle": "Open Sicilian",
    "icon": "🐉",
    "eco": "B50",
    "description": "Open Sicilian — วิธีตอบ 1...c5 ที่นิยมที่สุด เปิดศูนย์กลางและสู้เพื่อควบคุมกระดาน",
    "line": "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5 7.Nb3 Be6 8.f3 Nbd7 9.Qd2 g6 10.Be2",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. e4",
        "instruction": "เปิด e4 ตามปกติ",
        "expected": {
          "from": "e2",
          "to": "e4"
        },
        "opponentMove": {
          "from": "c7",
          "to": "c5"
        },
        "opponentSan": "1...c5"
      },
      {
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "san": "2. Nf3",
        "instruction": "Nf3 เตรียมผลัก d4 — แผน Open Sicilian",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "hint": "Sicilian คือตอบ 1...c5 ที่นิยมที่สุด",
        "opponentMove": {
          "from": "d7",
          "to": "d6"
        },
        "opponentSan": "2...d6"
      },
      {
        "fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        "san": "3. d4",
        "instruction": "ผลัก d4! เปิดศูนย์กลาง",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "hint": "หัวใจของ Open Sicilian",
        "opponentMove": {
          "from": "c5",
          "to": "d4"
        },
        "opponentSan": "3...cxd4"
      },
      {
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
        "san": "4. Nxd4",
        "instruction": "กินเบี้ยด้วยม้า — ม้าอยู่ศูนย์กลางแข็งแกร่ง",
        "expected": {
          "from": "f3",
          "to": "d4"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "4...Nf6"
      },
      {
        "fen": "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5",
        "san": "5. Nc3",
        "instruction": "พัฒนาม้า c3 — ปกป้อง e4",
        "expected": {
          "from": "b1",
          "to": "c3"
        },
        "hint": "Najdorf/Scheveningen เริ่มจากนี้",
        "opponentMove": {
          "from": "a7",
          "to": "a6"
        },
        "opponentSan": "5...a6"
      },
      {
        "fen": "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        "san": "6. Be3",
        "instruction": "บิชอป e3 คุมแนวทแยง g5 — ป้องกันม้าไล่บิชอป",
        "expected": {
          "from": "c1",
          "to": "e3"
        },
        "hint": "English Attack setup",
        "opponentMove": {
          "from": "e7",
          "to": "e5"
        },
        "opponentSan": "6...e5"
      },
      {
        "fen": "rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7",
        "san": "7. Nb3",
        "instruction": "ถอยม้า b3 — หลีกเลี่ยง ...e5 ไล่ม้า",
        "expected": {
          "from": "d4",
          "to": "b3"
        },
        "hint": "รักษาม้ากลางไว้",
        "opponentMove": {
          "from": "c8",
          "to": "e6"
        },
        "opponentSan": "7...Be6"
      },
      {
        "fen": "rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R w KQkq - 2 8",
        "san": "8. f3",
        "instruction": "f3 รองรับ e4 — เตรียมส่งควีนไป d2",
        "expected": {
          "from": "f2",
          "to": "f3"
        },
        "hint": "แผน Scheveningen มาตรฐาน",
        "opponentMove": {
          "from": "b8",
          "to": "d7"
        },
        "opponentSan": "8...Nbd7"
      },
      {
        "fen": "r2qkb1r/1p1n1ppp/p2pbn2/4p3/4P3/1NN1BP2/PPP3PP/R2QKB1R w KQkq - 1 9",
        "san": "9. Qd2",
        "instruction": "ควีน d2 เชื่อมเรือ — เตรียม castling ฝั่งคิง",
        "expected": {
          "from": "d1",
          "to": "d2"
        },
        "hint": "English Attack คลาสสิก",
        "opponentMove": {
          "from": "g7",
          "to": "g6"
        },
        "opponentSan": "9...g6"
      },
      {
        "fen": "r2qkb1r/1p1n1p1p/p2pbnp1/4p3/4P3/1NN1BP2/PPPQ2PP/R3KB1R w KQkq - 0 10",
        "san": "10. Be2",
        "instruction": "บิชอป e2 รองรับ castling — พร้อมสู่กลางเกม",
        "expected": {
          "from": "f1",
          "to": "e2"
        },
        "hint": "แผนต่อ: O-O-O หรือ O-O"
      }
    ]
  }
];

export function getLessonById(id) {
  return lessons.find((l) => l.id === id) ?? null;
}

const STORAGE_KEY = "chess-opening-lessons-progress";

export function getCompletedLessons() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markLessonComplete(lessonId) {
  const done = getCompletedLessons();
  if (!done.includes(lessonId)) {
    done.push(lessonId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }
}

export function isLessonComplete(lessonId) {
  return getCompletedLessons().includes(lessonId);
}
