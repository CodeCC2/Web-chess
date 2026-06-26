/**
 * บทเรียนเปิดเกม — ระดับกลาง–แข็ง (10–15+ ตา + สายรอง + แผนกลางเกม)
 */

export const lessons = [
  {
    "id": "ruy-lopez",
    "kind": "main",
    "title": "Ruy Lopez",
    "subtitle": "สายหลัก Morphy Defense",
    "icon": "🇪🇸",
    "eco": "C88",
    "description": "เปิดสเปนคลาสสิก — กดดันม้า c6 ขยายศูนย์กลางด้วย d4",
    "middlegamePlan": "แผนกลางเกม: ม้า d2/c3 กดดัน e5, เรือเปิดคอลัมน์, บิชอป c2 ชี้ h7",
    "line": "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d6 h3 Bb7 d4 exd4 cxd4 b4 Nbd2 Re8 a3 Na5 Bc2 Rc8 Qe2 Nd7",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. e4",
        "instruction": "เปิดด้วย e4 — ครองศูนย์กลาง",
        "expected": {
          "from": "e2",
          "to": "e4"
        },
        "hint": "King's Pawn ยอดนิยม",
        "opponentMove": {
          "from": "e7",
          "to": "e5"
        },
        "opponentSan": "1...e5"
      },
      {
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "san": "2. Nf3",
        "instruction": "พัฒนาม้า โจมตี e5",
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
        "san": "3. Bb5",
        "instruction": "Ruy Lopez! กดดันม้า c6",
        "expected": {
          "from": "f1",
          "to": "b5"
        },
        "opponentMove": {
          "from": "a7",
          "to": "a6"
        },
        "opponentSan": "3...a6"
      },
      {
        "fen": "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
        "san": "4. Ba4",
        "instruction": "ถอย Ba4 — Morphy Defense",
        "expected": {
          "from": "b5",
          "to": "a4"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "4...Nf6"
      },
      {
        "fen": "r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 5",
        "san": "5. O-O",
        "instruction": "Castling สั้น",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "opponentMove": {
          "from": "f8",
          "to": "e7"
        },
        "opponentSan": "5...Be7"
      },
      {
        "fen": "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 6",
        "san": "6. Re1",
        "instruction": "เรือ e1 ชี้ e5",
        "expected": {
          "from": "f1",
          "to": "e1"
        },
        "opponentMove": {
          "from": "b7",
          "to": "b5"
        },
        "opponentSan": "6...b5"
      },
      {
        "fen": "r1bqk2r/2ppbppp/p1n2n2/1p2p3/B3P3/5N2/PPPP1PPP/RNBQR1K1 w kq - 0 7",
        "san": "7. Bb3",
        "instruction": "ถอยบิชอป รักษาความกดดัน",
        "expected": {
          "from": "a4",
          "to": "b3"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "7...O-O"
      },
      {
        "fen": "r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w - - 2 8",
        "san": "8. c3",
        "instruction": "c3 เตรียม d4",
        "expected": {
          "from": "c2",
          "to": "c3"
        },
        "opponentMove": {
          "from": "d7",
          "to": "d6"
        },
        "opponentSan": "8...d6"
      },
      {
        "fen": "r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 0 9",
        "san": "9. h3",
        "instruction": "h3 ป้องกันม้าไป g4",
        "expected": {
          "from": "h2",
          "to": "h3"
        },
        "opponentMove": {
          "from": "c8",
          "to": "b7"
        },
        "opponentSan": "9...Bb7"
      },
      {
        "fen": "r2q1rk1/1bp1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 w - - 1 10",
        "san": "10. d4",
        "instruction": "ผลัก d4! ท้าทายศูนย์กลาง",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "opponentMove": {
          "from": "e5",
          "to": "d4"
        },
        "opponentSan": "10...exd4"
      },
      {
        "fen": "r2q1rk1/1bp1bppp/p1np1n2/1p6/3pP3/1BP2N1P/PP3PP1/RNBQR1K1 w - - 0 11",
        "san": "11. cxd4",
        "instruction": "กินเบี้ยคืน — เปิดคอลัมน์ c",
        "expected": {
          "from": "c3",
          "to": "d4"
        },
        "opponentMove": {
          "from": "b5",
          "to": "b4"
        },
        "opponentSan": "11...b4"
      },
      {
        "fen": "r2q1rk1/1bp1bppp/p1np1n2/8/1p1PP3/1B3N1P/PP3PP1/RNBQR1K1 w - - 0 12",
        "san": "12. Nd2",
        "instruction": "ม้า d2 หลบ b4",
        "expected": {
          "from": "b1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "f8",
          "to": "e8"
        },
        "opponentSan": "12...Re8"
      },
      {
        "fen": "r2qr1k1/1bp1bppp/p1np1n2/8/1p1PP3/1B3N1P/PP1N1PP1/R1BQR1K1 w - - 2 13",
        "san": "13. a3",
        "instruction": "a3 ถามเบี้ย b4",
        "expected": {
          "from": "a2",
          "to": "a3"
        },
        "opponentMove": {
          "from": "c6",
          "to": "a5"
        },
        "opponentSan": "13...Na5"
      },
      {
        "fen": "r2qr1k1/1bp1bppp/p2p1n2/n7/1p1PP3/PB3N1P/1P1N1PP1/R1BQR1K1 w - - 1 14",
        "san": "14. Bc2",
        "instruction": "บิชอป c2 ชี้ h7",
        "expected": {
          "from": "b3",
          "to": "c2"
        },
        "opponentMove": {
          "from": "a8",
          "to": "c8"
        },
        "opponentSan": "14...Rc8"
      },
      {
        "fen": "2rqr1k1/1bp1bppp/p2p1n2/n7/1p1PP3/P4N1P/1PBN1PP1/R1BQR1K1 w - - 3 15",
        "san": "15. Qe2",
        "instruction": "ควีน e2 เชื่อมเรือ",
        "expected": {
          "from": "d1",
          "to": "e2"
        },
        "opponentMove": {
          "from": "f6",
          "to": "d7"
        },
        "opponentSan": "15...Nbd7"
      }
    ]
  },
  {
    "id": "ruy-lopez-berlin",
    "kind": "variation",
    "title": "Ruy Lopez",
    "subtitle": "สายรอง: Berlin Defense",
    "icon": "🇪🇸",
    "eco": "C67",
    "description": "ถ้าคู่เล่น 3...Nf6 — Berlin Defense ยอดนิยมในระดับมาสเตอร์",
    "middlegamePlan": "Berlin มักแลกควีน — รักษาความสมดุล เน้นพัฒนาหมากและควบคุมศูนย์กลาง",
    "line": "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8 Nc3 Nd6 Rd1 Be6 h3 h6 b3 a5 Be3 Be7 Rd2 Rc8 Rad1 Ke8",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. e4",
        "instruction": "เปิด e4",
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
        "instruction": "พัฒนาม้า",
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
        "san": "3. Bb5",
        "instruction": "Ruy Lopez",
        "expected": {
          "from": "f1",
          "to": "b5"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "3...Nf6"
      },
      {
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        "san": "4. O-O",
        "instruction": "Castling — สาย Berlin",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "hint": "คู่มักกิน e4",
        "opponentMove": {
          "from": "f6",
          "to": "e4"
        },
        "opponentSan": "4...Nxe4"
      },
      {
        "fen": "r1bqkb1r/pppp1ppp/2n5/1B2p3/4n3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 5",
        "san": "5. d4",
        "instruction": "d4 ไล่ม้า e4",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "opponentMove": {
          "from": "e4",
          "to": "d6"
        },
        "opponentSan": "5...Nd6"
      },
      {
        "fen": "r1bqkb1r/pppp1ppp/2nn4/1B2p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 6",
        "san": "6. Bxc6",
        "instruction": "แลกม้า — Berlin Exchange",
        "expected": {
          "from": "b5",
          "to": "c6"
        },
        "opponentMove": {
          "from": "d7",
          "to": "c6"
        },
        "opponentSan": "6...dxc6"
      },
      {
        "fen": "r1bqkb1r/ppp2ppp/2pn4/4p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 7",
        "san": "7. dxe5",
        "instruction": "กินเบี้ย e5",
        "expected": {
          "from": "d4",
          "to": "e5"
        },
        "opponentMove": {
          "from": "d6",
          "to": "f5"
        },
        "opponentSan": "7...Nf5"
      },
      {
        "fen": "r1bqkb1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 8",
        "san": "8. Qxd8+",
        "instruction": "แลกควีน",
        "expected": {
          "from": "d1",
          "to": "d8"
        },
        "opponentMove": {
          "from": "e8",
          "to": "d8"
        },
        "opponentSan": "8...Kxd8"
      },
      {
        "fen": "r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w - - 0 9",
        "san": "9. Nc3",
        "instruction": "พัฒนาม้า c3",
        "expected": {
          "from": "b1",
          "to": "c3"
        },
        "opponentMove": {
          "from": "f5",
          "to": "d6"
        },
        "opponentSan": "9...Nd6"
      },
      {
        "fen": "r1bk1b1r/ppp2ppp/2pn4/4P3/8/2N2N2/PPP2PPP/R1B2RK1 w - - 2 10",
        "san": "10. Rd1",
        "instruction": "เรือ d1 กดดัน d6",
        "expected": {
          "from": "f1",
          "to": "d1"
        },
        "opponentMove": {
          "from": "c8",
          "to": "e6"
        },
        "opponentSan": "10...Be6"
      },
      {
        "fen": "r2k1b1r/ppp2ppp/2pnb3/4P3/8/2N2N2/PPP2PPP/R1BR2K1 w - - 4 11",
        "san": "11. h3",
        "instruction": "h3 ป้องกัน Bg4",
        "expected": {
          "from": "h2",
          "to": "h3"
        },
        "opponentMove": {
          "from": "h7",
          "to": "h6"
        },
        "opponentSan": "11...h6"
      },
      {
        "fen": "r2k1b1r/ppp2pp1/2pnb2p/4P3/8/2N2N1P/PPP2PP1/R1BR2K1 w - - 0 12",
        "san": "12. b3",
        "instruction": "b3 เตรียม Bb2",
        "expected": {
          "from": "b2",
          "to": "b3"
        },
        "opponentMove": {
          "from": "a7",
          "to": "a5"
        },
        "opponentSan": "12...a5"
      },
      {
        "fen": "r2k1b1r/1pp2pp1/2pnb2p/p3P3/8/1PN2N1P/P1P2PP1/R1BR2K1 w - - 0 13",
        "san": "13. Be3",
        "instruction": "พัฒนาบิชอป",
        "expected": {
          "from": "c1",
          "to": "e3"
        },
        "opponentMove": {
          "from": "f8",
          "to": "e7"
        },
        "opponentSan": "13...Be7"
      },
      {
        "fen": "r2k3r/1pp1bpp1/2pnb2p/p3P3/8/1PN1BN1P/P1P2PP1/R2R2K1 w - - 2 14",
        "san": "14. Rd2",
        "instruction": "เรือ d2",
        "expected": {
          "from": "d1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "a8",
          "to": "c8"
        },
        "opponentSan": "14...Rc8"
      },
      {
        "fen": "2rk3r/1pp1bpp1/2pnb2p/p3P3/8/1PN1BN1P/P1PR1PP1/R5K1 w - - 4 15",
        "san": "15. Rad1",
        "instruction": "เรือคู่ d1",
        "expected": {
          "from": "a1",
          "to": "d1"
        },
        "opponentMove": {
          "from": "d8",
          "to": "e8"
        },
        "opponentSan": "15...Ke8"
      }
    ]
  },
  {
    "id": "queens-gambit-declined",
    "kind": "main",
    "title": "Queen's Gambit",
    "subtitle": "Declined — สายหลัก",
    "icon": "♕",
    "eco": "D37",
    "description": "QGD Orthodox — ต่อสู้ศูนย์กลางและพัฒนาหมากอย่างมั่นคง",
    "middlegamePlan": "แผนกลางเกม: ม้า e2/f4, เรือ c1/e1 ควบคุมคอลัมน์เปิด, กดดัน d5",
    "line": "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Bd3 c5 cxd5 exd5 Ne5 Nxe5 Bxf6 Bxf6 Qc2 b6 O-O Bb7 Rac1 cxd4 exd4 Rc8 Ne2 Nd7",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. d4",
        "instruction": "เปิด d4",
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
        "instruction": "Queen's Gambit",
        "expected": {
          "from": "c2",
          "to": "c4"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e6"
        },
        "opponentSan": "2...e6"
      },
      {
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "san": "3. Nc3",
        "instruction": "พัฒนาม้า c3",
        "expected": {
          "from": "b1",
          "to": "c3"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "3...Nf6"
      },
      {
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
        "san": "4. Bg5",
        "instruction": "บิชอป g5 กดดัน f6",
        "expected": {
          "from": "c1",
          "to": "g5"
        },
        "opponentMove": {
          "from": "f8",
          "to": "e7"
        },
        "opponentSan": "4...Be7"
      },
      {
        "fen": "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq - 4 5",
        "san": "5. e3",
        "instruction": "e3 สร้างฐาน",
        "expected": {
          "from": "e2",
          "to": "e3"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "5...O-O"
      },
      {
        "fen": "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR w KQ - 1 6",
        "san": "6. Nf3",
        "instruction": "พัฒนาม้าคู่",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "b8",
          "to": "d7"
        },
        "opponentSan": "6...Nbd7"
      },
      {
        "fen": "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 3 7",
        "san": "7. Bd3",
        "instruction": "บิชอป d3 ชี้ h7",
        "expected": {
          "from": "f1",
          "to": "d3"
        },
        "opponentMove": {
          "from": "c7",
          "to": "c5"
        },
        "opponentSan": "7...c5"
      },
      {
        "fen": "r1bq1rk1/pp1nbppp/4pn2/2pp2B1/2PP4/2NBPN2/PP3PPP/R2QK2R w KQ - 0 8",
        "san": "8. cxd5",
        "instruction": "แลก d5",
        "expected": {
          "from": "c4",
          "to": "d5"
        },
        "opponentMove": {
          "from": "e6",
          "to": "d5"
        },
        "opponentSan": "8...exd5"
      },
      {
        "fen": "r1bq1rk1/pp1nbppp/5n2/2pp2B1/3P4/2NBPN2/PP3PPP/R2QK2R w KQ - 0 9",
        "san": "9. Ne5",
        "instruction": "ม้า e5",
        "expected": {
          "from": "f3",
          "to": "e5"
        },
        "opponentMove": {
          "from": "d7",
          "to": "e5"
        },
        "opponentSan": "9...Nxe5"
      },
      {
        "fen": "r1bq1rk1/pp2bppp/5n2/2ppn1B1/3P4/2NBP3/PP3PPP/R2QK2R w KQ - 0 10",
        "san": "10. Bxf6",
        "instruction": "กินม้า f6",
        "expected": {
          "from": "g5",
          "to": "f6"
        },
        "opponentMove": {
          "from": "e7",
          "to": "f6"
        },
        "opponentSan": "10...Bxf6"
      },
      {
        "fen": "r1bq1rk1/pp3ppp/5b2/2ppn3/3P4/2NBP3/PP3PPP/R2QK2R w KQ - 0 11",
        "san": "11. Qc2",
        "instruction": "ควีน c2",
        "expected": {
          "from": "d1",
          "to": "c2"
        },
        "opponentMove": {
          "from": "b7",
          "to": "b6"
        },
        "opponentSan": "11...b6"
      },
      {
        "fen": "r1bq1rk1/p4ppp/1p3b2/2ppn3/3P4/2NBP3/PPQ2PPP/R3K2R w KQ - 0 12",
        "san": "12. O-O",
        "instruction": "Castling",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "opponentMove": {
          "from": "c8",
          "to": "b7"
        },
        "opponentSan": "12...Bb7"
      },
      {
        "fen": "r2q1rk1/pb3ppp/1p3b2/2ppn3/3P4/2NBP3/PPQ2PPP/R4RK1 w - - 2 13",
        "san": "13. Rc1",
        "instruction": "เรือ c1",
        "expected": {
          "from": "a1",
          "to": "c1"
        },
        "opponentMove": {
          "from": "c5",
          "to": "d4"
        },
        "opponentSan": "13...cxd4"
      },
      {
        "fen": "r2q1rk1/pb3ppp/1p3b2/3pn3/3p4/2NBP3/PPQ2PPP/2R2RK1 w - - 0 14",
        "san": "14. exd4",
        "instruction": "กิน d4",
        "expected": {
          "from": "e3",
          "to": "d4"
        },
        "opponentMove": {
          "from": "a8",
          "to": "c8"
        },
        "opponentSan": "14...Rc8"
      },
      {
        "fen": "2rq1rk1/pb3ppp/1p3b2/3pn3/3P4/2NB4/PPQ2PPP/2R2RK1 w - - 1 15",
        "san": "15. Ne2",
        "instruction": "ม้า e2 — โครงสร้าง QGD สมบูรณ์",
        "expected": {
          "from": "c3",
          "to": "e2"
        },
        "opponentMove": {
          "from": "e5",
          "to": "d7"
        },
        "opponentSan": "15...Nbd7"
      }
    ]
  },
  {
    "id": "qgd-tartakower",
    "kind": "variation",
    "title": "Queen's Gambit",
    "subtitle": "สายรอง: Tartakower (5...b6)",
    "icon": "♕",
    "eco": "D58",
    "description": "สายรองยอดนิยม — คู่เล่น b6 แทน Nbd7",
    "middlegamePlan": "Tartakower: คู่ตี b6-Bb7 แลกบิชอป — เป้าหมาย e4/c5 ท้าทายศูนย์กลาง",
    "line": "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 b6 Bd3 Bb7 O-O Nbd7 Qe2 c5 dxc5 bxc5",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. d4",
        "instruction": "เปิด d4",
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
        "instruction": "Queen's Gambit",
        "expected": {
          "from": "c2",
          "to": "c4"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e6"
        },
        "opponentSan": "2...e6"
      },
      {
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "san": "3. Nc3",
        "instruction": "พัฒนาม้า",
        "expected": {
          "from": "b1",
          "to": "c3"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "3...Nf6"
      },
      {
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
        "san": "4. Bg5",
        "instruction": "บิชอป g5",
        "expected": {
          "from": "c1",
          "to": "g5"
        },
        "opponentMove": {
          "from": "f8",
          "to": "e7"
        },
        "opponentSan": "4...Be7"
      },
      {
        "fen": "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq - 4 5",
        "san": "5. e3",
        "instruction": "e3",
        "expected": {
          "from": "e2",
          "to": "e3"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "5...O-O"
      },
      {
        "fen": "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR w KQ - 1 6",
        "san": "6. Nf3",
        "instruction": "ม้าคู่ — คู่เล่น b6!",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "b7",
          "to": "b6"
        },
        "opponentSan": "6...b6"
      },
      {
        "fen": "rnbq1rk1/p1p1bppp/1p2pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 0 7",
        "san": "7. Bd3",
        "instruction": "บิชอป d3 รอ Bb7",
        "expected": {
          "from": "f1",
          "to": "d3"
        },
        "opponentMove": {
          "from": "c8",
          "to": "b7"
        },
        "opponentSan": "7...Bb7"
      },
      {
        "fen": "rn1q1rk1/pbp1bppp/1p2pn2/3p2B1/2PP4/2NBPN2/PP3PPP/R2QK2R w KQ - 2 8",
        "san": "8. O-O",
        "instruction": "Castling",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "opponentMove": {
          "from": "b8",
          "to": "d7"
        },
        "opponentSan": "8...Nbd7"
      },
      {
        "fen": "r2q1rk1/pbpnbppp/1p2pn2/3p2B1/2PP4/2NBPN2/PP3PPP/R2Q1RK1 w - - 4 9",
        "san": "9. Qe2",
        "instruction": "ควีน e2 เตรียมรุก",
        "expected": {
          "from": "d1",
          "to": "e2"
        },
        "opponentMove": {
          "from": "c7",
          "to": "c5"
        },
        "opponentSan": "9...c5"
      },
      {
        "fen": "r2q1rk1/pb1nbppp/1p2pn2/2pp2B1/2PP4/2NBPN2/PP2QPPP/R4RK1 w - - 0 10",
        "san": "10. dxc5",
        "instruction": "กิน c5 — ได้พื้นที่",
        "expected": {
          "from": "d4",
          "to": "c5"
        },
        "opponentMove": {
          "from": "b6",
          "to": "c5"
        },
        "opponentSan": "10...bxc5"
      }
    ]
  },
  {
    "id": "queens-gambit-accepted",
    "kind": "main",
    "title": "Queen's Gambit",
    "subtitle": "Accepted — สายหลัก",
    "icon": "♛",
    "eco": "D26",
    "description": "QGA — ตอบรับเบี้ย c แล้วพัฒนาเร็วกว่าเพื่อแย่งคืนพื้นที่กลาง",
    "middlegamePlan": "หลัง QGA: รักษาเบี้ยคู่ e4-d4, พัฒนาม้าเร็ว, กดดัน c7/c5",
    "line": "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 b3 b5 Bd3 Bb7 Nbd2 cxd4 exd4 Be7",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. d4",
        "instruction": "เปิด d4",
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
        "instruction": "Queen's Gambit",
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
        "san": "3. Nf3",
        "instruction": "พัฒนาม้าก่อนกินคืน",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "3...Nf6"
      },
      {
        "fen": "rnbqkb1r/ppp1pppp/5n2/8/2pP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 4",
        "san": "4. e3",
        "instruction": "e3 รองรับ d4",
        "expected": {
          "from": "e2",
          "to": "e3"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e6"
        },
        "opponentSan": "4...e6"
      },
      {
        "fen": "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/4PN2/PP3PPP/RNBQKB1R w KQkq - 0 5",
        "san": "5. Bxc4",
        "instruction": "กินเบี้ยคืน",
        "expected": {
          "from": "f1",
          "to": "c4"
        },
        "opponentMove": {
          "from": "c7",
          "to": "c5"
        },
        "opponentSan": "5...c5"
      },
      {
        "fen": "rnbqkb1r/pp3ppp/4pn2/2p5/2BP4/4PN2/PP3PPP/RNBQK2R w KQkq - 0 6",
        "san": "6. O-O",
        "instruction": "Castling",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "opponentMove": {
          "from": "a7",
          "to": "a6"
        },
        "opponentSan": "6...a6"
      },
      {
        "fen": "rnbqkb1r/1p3ppp/p3pn2/2p5/2BP4/4PN2/PP3PPP/RNBQ1RK1 w kq - 0 7",
        "san": "7. b3",
        "instruction": "b3 รองรับ c4",
        "expected": {
          "from": "b2",
          "to": "b3"
        },
        "opponentMove": {
          "from": "b7",
          "to": "b5"
        },
        "opponentSan": "7...b5"
      },
      {
        "fen": "rnbqkb1r/5ppp/p3pn2/1pp5/2BP4/1P2PN2/P4PPP/RNBQ1RK1 w kq - 0 8",
        "san": "8. Bd3",
        "instruction": "บิชอป d3",
        "expected": {
          "from": "c4",
          "to": "d3"
        },
        "opponentMove": {
          "from": "c8",
          "to": "b7"
        },
        "opponentSan": "8...Bb7"
      },
      {
        "fen": "rn1qkb1r/1b3ppp/p3pn2/1pp5/3P4/1P1BPN2/P4PPP/RNBQ1RK1 w kq - 2 9",
        "san": "9. Nbd2",
        "instruction": "ม้าคู่",
        "expected": {
          "from": "b1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "c5",
          "to": "d4"
        },
        "opponentSan": "9...cxd4"
      },
      {
        "fen": "rn1qkb1r/1b3ppp/p3pn2/1p6/3p4/1P1BPN2/P2N1PPP/R1BQ1RK1 w kq - 0 10",
        "san": "10. exd4",
        "instruction": "กิน d4 — โครงสร้าง QGA",
        "expected": {
          "from": "e3",
          "to": "d4"
        },
        "opponentMove": {
          "from": "f8",
          "to": "e7"
        },
        "opponentSan": "10...Be7"
      }
    ]
  },
  {
    "id": "qga-albin",
    "kind": "variation",
    "title": "Queen's Gambit",
    "subtitle": "สายรอง: Albin Countergambit",
    "icon": "♛",
    "eco": "D08",
    "description": "ถ้าคู่เล่น 2...e5 แทนรับ gambit — Albin Countergambit",
    "middlegamePlan": "Albin: ระวังเบี้ย d4 ที่อาจกลายเป็น passer — พัฒนาเร็วและกดดัน e5",
    "line": "d4 d5 c4 e5 dxe5 Bc5 g3 d4 Bg2 Nc6 Nf3 Nge7 O-O O-O e3 Bb6",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. d4",
        "instruction": "เปิด d4",
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
        "instruction": "Queen's Gambit",
        "expected": {
          "from": "c2",
          "to": "c4"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e5"
        },
        "opponentSan": "2...e5"
      },
      {
        "fen": "rnbqkbnr/ppp2ppp/8/3pp3/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "san": "3. dxe5",
        "instruction": "กิน e5",
        "expected": {
          "from": "d4",
          "to": "e5"
        },
        "opponentMove": {
          "from": "f8",
          "to": "c5"
        },
        "opponentSan": "3...Bc5"
      },
      {
        "fen": "rnbqk1nr/ppp2ppp/8/2bpP3/2P5/8/PP2PPPP/RNBQKBNR w KQkq - 1 4",
        "san": "4. g3",
        "instruction": "g3 รองรับ d4",
        "expected": {
          "from": "g2",
          "to": "g3"
        },
        "opponentMove": {
          "from": "d5",
          "to": "d4"
        },
        "opponentSan": "4...d4"
      },
      {
        "fen": "rnbqk1nr/ppp2ppp/8/2b1P3/2Pp4/6P1/PP2PP1P/RNBQKBNR w KQkq - 0 5",
        "san": "5. Bg2",
        "instruction": "บิชอป g2",
        "expected": {
          "from": "f1",
          "to": "g2"
        },
        "opponentMove": {
          "from": "b8",
          "to": "c6"
        },
        "opponentSan": "5...Nc6"
      },
      {
        "fen": "r1bqk1nr/ppp2ppp/2n5/2b1P3/2Pp4/6P1/PP2PPBP/RNBQK1NR w KQkq - 2 6",
        "san": "6. Nf3",
        "instruction": "พัฒนาม้า",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "g8",
          "to": "e7"
        },
        "opponentSan": "6...Nge7"
      },
      {
        "fen": "r1bqk2r/ppp1nppp/2n5/2b1P3/2Pp4/5NP1/PP2PPBP/RNBQK2R w KQkq - 4 7",
        "san": "7. O-O",
        "instruction": "Castling",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "7...O-O"
      },
      {
        "fen": "r1bq1rk1/ppp1nppp/2n5/2b1P3/2Pp4/5NP1/PP2PPBP/RNBQ1RK1 w - - 6 8",
        "san": "8. e3",
        "instruction": "e3 ท้าทาย d4",
        "expected": {
          "from": "e2",
          "to": "e3"
        },
        "opponentMove": {
          "from": "c5",
          "to": "b6"
        },
        "opponentSan": "8...Bb6"
      }
    ]
  },
  {
    "id": "italian-game",
    "kind": "main",
    "title": "Italian Game",
    "subtitle": "Giuoco Piano — สายหลัก",
    "icon": "🇮🇹",
    "eco": "C50",
    "description": "Italian Game — ชี้ f7 และผลัก d4 ท้าทายศูนย์กลาง",
    "middlegamePlan": "Italian: หลัง O-O มุ่ง Re1/Bb3 กดดัน f7, ควบคุมคอลัมน์เปิด",
    "line": "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5 exd5 Nxd5 O-O O-O Re1 Re8 Bb3 Nce7",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. e4",
        "instruction": "เปิด e4",
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
        "instruction": "พัฒนาม้า",
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
        "instruction": "Italian! ชี้ f7",
        "expected": {
          "from": "f1",
          "to": "c4"
        },
        "opponentMove": {
          "from": "f8",
          "to": "c5"
        },
        "opponentSan": "3...Bc5"
      },
      {
        "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        "san": "4. c3",
        "instruction": "c3 เตรียม d4",
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
        "instruction": "ผลัก d4!",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "opponentMove": {
          "from": "e5",
          "to": "d4"
        },
        "opponentSan": "5...exd4"
      },
      {
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2R w KQkq - 0 6",
        "san": "6. cxd4",
        "instruction": "กินเบี้ยคืน",
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
        "instruction": "ตอบรุก",
        "expected": {
          "from": "c1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "b4",
          "to": "d2"
        },
        "opponentSan": "7...Bxd2+"
      },
      {
        "fen": "r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1b1PPP/RN1QK2R w KQkq - 0 8",
        "san": "8. Nbxd2",
        "instruction": "กินบิชอป",
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
        "instruction": "กิน d5",
        "expected": {
          "from": "e4",
          "to": "d5"
        },
        "opponentMove": {
          "from": "f6",
          "to": "d5"
        },
        "opponentSan": "9...Nxd5"
      },
      {
        "fen": "r1bqk2r/ppp2ppp/2n5/3n4/2BP4/5N2/PP1N1PPP/R2QK2R w KQkq - 0 10",
        "san": "10. O-O",
        "instruction": "Castling",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "10...O-O"
      },
      {
        "fen": "r1bq1rk1/ppp2ppp/2n5/3n4/2BP4/5N2/PP1N1PPP/R2Q1RK1 w - - 2 11",
        "san": "11. Re1",
        "instruction": "เรือ e1 กดดัน e5",
        "expected": {
          "from": "f1",
          "to": "e1"
        },
        "opponentMove": {
          "from": "f8",
          "to": "e8"
        },
        "opponentSan": "11...Re8"
      },
      {
        "fen": "r1bqr1k1/ppp2ppp/2n5/3n4/2BP4/5N2/PP1N1PPP/R2QR1K1 w - - 4 12",
        "san": "12. Bb3",
        "instruction": "Bb3 ชี้ f7 — แผนกลางเกม",
        "expected": {
          "from": "c4",
          "to": "b3"
        },
        "opponentMove": {
          "from": "c6",
          "to": "e7"
        },
        "opponentSan": "12...Be7"
      }
    ]
  },
  {
    "id": "italian-two-knights",
    "kind": "variation",
    "title": "Italian Game",
    "subtitle": "สายรอง: Two Knights Defense",
    "icon": "🇮🇹",
    "eco": "C57",
    "description": "ถ้าคู่เล่น 3...Nf6 แทน Bc5 — Two Knights",
    "middlegamePlan": "Two Knights: Ng5 คุกคาม f7 — เป้าหมาย d4 เร็วหรือ Fried Liver",
    "line": "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Bd3 Bd7",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. e4",
        "instruction": "เปิด e4",
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
        "instruction": "พัฒนาม้า",
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
        "instruction": "Italian",
        "expected": {
          "from": "f1",
          "to": "c4"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "3...Nf6"
      },
      {
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        "san": "4. Ng5",
        "instruction": "Ng5! Two Knights",
        "expected": {
          "from": "f3",
          "to": "g5"
        },
        "opponentMove": {
          "from": "d7",
          "to": "d5"
        },
        "opponentSan": "4...d5"
      },
      {
        "fen": "r1bqkb1r/ppp2ppp/2n2n2/3pp1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 5",
        "san": "5. exd5",
        "instruction": "กิน d5",
        "expected": {
          "from": "e4",
          "to": "d5"
        },
        "opponentMove": {
          "from": "c6",
          "to": "a5"
        },
        "opponentSan": "5...Na5"
      },
      {
        "fen": "r1bqkb1r/ppp2ppp/5n2/n2Pp1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 1 6",
        "san": "6. Bb5+",
        "instruction": "รุกบวก",
        "expected": {
          "from": "c4",
          "to": "b5"
        },
        "opponentMove": {
          "from": "c7",
          "to": "c6"
        },
        "opponentSan": "6...c6"
      },
      {
        "fen": "r1bqkb1r/pp3ppp/2p2n2/nB1Pp1N1/8/8/PPPP1PPP/RNBQK2R w KQkq - 0 7",
        "san": "7. dxc6",
        "instruction": "กิน c6",
        "expected": {
          "from": "d5",
          "to": "c6"
        },
        "opponentMove": {
          "from": "b7",
          "to": "c6"
        },
        "opponentSan": "7...bxc6"
      },
      {
        "fen": "r1bqkb1r/p4ppp/2p2n2/nB2p1N1/8/8/PPPP1PPP/RNBQK2R w KQkq - 0 8",
        "san": "8. Bd3",
        "instruction": "พัฒนาบิชอป — ได้เปรียบพัฒนา",
        "expected": {
          "from": "b5",
          "to": "d3"
        },
        "opponentMove": {
          "from": "c8",
          "to": "d7"
        },
        "opponentSan": "8...Bd7"
      }
    ]
  },
  {
    "id": "london-system",
    "kind": "main",
    "title": "London System",
    "subtitle": "สายหลัก",
    "icon": "🏰",
    "eco": "D02",
    "description": "London — แผนเปิดที่จำง่าย ใช้ซ้ำได้เกือบทุกเกม",
    "middlegamePlan": "London: Bf4-e3-Nf3-Nbd2-c3, มุ่ง e4 ขยายศูนย์กลาง",
    "line": "d4 d5 Bf4 Nf6 e3 e6 Nf3 Bd6 Bg3 O-O Nbd2 Nbd7 c3 c5 Bd3 Qc7 O-O cxd4 cxd4 b6 Qe2 Bb7 e4 dxe4 Ne5 Bxe5 Bxe4 Nxe4 a3 Rac8",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. d4",
        "instruction": "เปิด d4",
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
        "instruction": "Bf4 ก่อน e3 — หัวใจ London",
        "expected": {
          "from": "c1",
          "to": "f4"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "2...Nf6"
      },
      {
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 2 3",
        "san": "3. e3",
        "instruction": "e3 รองรับ d4",
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
        "instruction": "พัฒนาม้า",
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
        "instruction": "ถอย Bg3",
        "expected": {
          "from": "f4",
          "to": "g3"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "5...O-O"
      },
      {
        "fen": "rnbq1rk1/ppp2ppp/3bpn2/3p4/3P4/4PNB1/PPP2PPP/RN1QKB1R w KQ - 4 6",
        "san": "6. Nbd2",
        "instruction": "ม้าคู่",
        "expected": {
          "from": "b1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "b8",
          "to": "d7"
        },
        "opponentSan": "6...Nbd7"
      },
      {
        "fen": "r1bq1rk1/pppn1ppp/3bpn2/3p4/3P4/4PNB1/PPPN1PPP/R2QKB1R w KQ - 6 7",
        "san": "7. c3",
        "instruction": "c3 รองรับ d4",
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
        "instruction": "บิชอป d3",
        "expected": {
          "from": "f1",
          "to": "d3"
        },
        "opponentMove": {
          "from": "d8",
          "to": "c7"
        },
        "opponentSan": "8...Qc7"
      },
      {
        "fen": "r1b2rk1/ppqn1ppp/3bpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2QK2R w KQ - 2 9",
        "san": "9. O-O",
        "instruction": "Castling",
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
        "instruction": "กิน d4",
        "expected": {
          "from": "c3",
          "to": "d4"
        },
        "opponentMove": {
          "from": "b7",
          "to": "b6"
        },
        "opponentSan": "10...b6"
      },
      {
        "fen": "r1b2rk1/p1qn1ppp/1p1bpn2/3p4/3P4/3BPNB1/PP1N1PPP/R2Q1RK1 w - - 0 11",
        "san": "11. Qe2",
        "instruction": "ควีน e2",
        "expected": {
          "from": "d1",
          "to": "e2"
        },
        "opponentMove": {
          "from": "c8",
          "to": "b7"
        },
        "opponentSan": "11...Bb7"
      },
      {
        "fen": "r4rk1/pbqn1ppp/1p1bpn2/3p4/3P4/3BPNB1/PP1NQPPP/R4RK1 w - - 2 12",
        "san": "12. e4",
        "instruction": "e4! ขยายศูนย์กลาง",
        "expected": {
          "from": "e3",
          "to": "e4"
        },
        "opponentMove": {
          "from": "d5",
          "to": "e4"
        },
        "opponentSan": "12...dxe4"
      },
      {
        "fen": "r4rk1/pbqn1ppp/1p1bpn2/8/3Pp3/3B1NB1/PP1NQPPP/R4RK1 w - - 0 13",
        "san": "13. Nxe5",
        "instruction": "กิน e5",
        "expected": {
          "from": "f3",
          "to": "e5"
        },
        "opponentMove": {
          "from": "d6",
          "to": "e5"
        },
        "opponentSan": "13...Bxe5"
      },
      {
        "fen": "r4rk1/pbqn1ppp/1p2pn2/4b3/3Pp3/3B2B1/PP1NQPPP/R4RK1 w - - 0 14",
        "san": "14. Bxe4",
        "instruction": "กิน e4",
        "expected": {
          "from": "d3",
          "to": "e4"
        },
        "opponentMove": {
          "from": "f6",
          "to": "e4"
        },
        "opponentSan": "14...Nxe4"
      },
      {
        "fen": "r4rk1/pbqn1ppp/1p2p3/4b3/3Pn3/6B1/PP1NQPPP/R4RK1 w - - 0 15",
        "san": "15. a3",
        "instruction": "a3 — โครงสร้าง London สมบูรณ์",
        "expected": {
          "from": "a2",
          "to": "a3"
        },
        "opponentMove": {
          "from": "a8",
          "to": "c8"
        },
        "opponentSan": "15...Rc8"
      }
    ]
  },
  {
    "id": "london-kings-indian",
    "kind": "variation",
    "title": "London System",
    "subtitle": "สายรอง: ตอบ King's Indian",
    "icon": "🏰",
    "eco": "A48",
    "description": "ถ้าคู่เล่น ...g6 และ ...Bg7 แทน ...e6",
    "middlegamePlan": "vs KID: คู่ตี c5/e5 — เป้าหมาย e4 break หรือ c4 ขยายฝั่งควีน",
    "line": "d4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 O-O Nbd7 h3 e5 dxe5 dxe5 Bxe5 Nxe5 Nbd2 Bg4",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. d4",
        "instruction": "เปิด d4",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "opponentMove": {
          "from": "g8",
          "to": "f6"
        },
        "opponentSan": "1...Nf6"
      },
      {
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "san": "2. Bf4",
        "instruction": "London vs Nf6",
        "expected": {
          "from": "c1",
          "to": "f4"
        },
        "opponentMove": {
          "from": "g7",
          "to": "g6"
        },
        "opponentSan": "2...g6"
      },
      {
        "fen": "rnbqkb1r/pppppp1p/5np1/8/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 0 3",
        "san": "3. e3",
        "instruction": "e3",
        "expected": {
          "from": "e2",
          "to": "e3"
        },
        "opponentMove": {
          "from": "f8",
          "to": "g7"
        },
        "opponentSan": "3...Bg7"
      },
      {
        "fen": "rnbqk2r/ppppppbp/5np1/8/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 1 4",
        "san": "4. Nf3",
        "instruction": "พัฒนาม้า",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "4...O-O"
      },
      {
        "fen": "rnbq1rk1/ppppppbp/5np1/8/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQ - 3 5",
        "san": "5. Be2",
        "instruction": "Be2",
        "expected": {
          "from": "f1",
          "to": "e2"
        },
        "opponentMove": {
          "from": "d7",
          "to": "d6"
        },
        "opponentSan": "5...d6"
      },
      {
        "fen": "rnbq1rk1/ppp1ppbp/3p1np1/8/3P1B2/4PN2/PPP1BPPP/RN1QK2R w KQ - 0 6",
        "san": "6. O-O",
        "instruction": "Castling",
        "expected": {
          "from": "e1",
          "to": "g1"
        },
        "opponentMove": {
          "from": "b8",
          "to": "d7"
        },
        "opponentSan": "6...Nbd7"
      },
      {
        "fen": "r1bq1rk1/pppnppbp/3p1np1/8/3P1B2/4PN2/PPP1BPPP/RN1Q1RK1 w - - 2 7",
        "san": "7. h3",
        "instruction": "h3 ป้องกัน Bg4",
        "expected": {
          "from": "h2",
          "to": "h3"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e5"
        },
        "opponentSan": "7...e5"
      },
      {
        "fen": "r1bq1rk1/pppn1pbp/3p1np1/4p3/3P1B2/4PN1P/PPP1BPP1/RN1Q1RK1 w - - 0 8",
        "san": "8. dxe5",
        "instruction": "กิน e5",
        "expected": {
          "from": "d4",
          "to": "e5"
        },
        "opponentMove": {
          "from": "d6",
          "to": "e5"
        },
        "opponentSan": "8...dxe5"
      },
      {
        "fen": "r1bq1rk1/pppn1pbp/5np1/4p3/5B2/4PN1P/PPP1BPP1/RN1Q1RK1 w - - 0 9",
        "san": "9. Bxe5",
        "instruction": "กิน e5",
        "expected": {
          "from": "f4",
          "to": "e5"
        },
        "opponentMove": {
          "from": "d7",
          "to": "e5"
        },
        "opponentSan": "9...Nxe5"
      },
      {
        "fen": "r1bq1rk1/ppp2pbp/5np1/4n3/8/4PN1P/PPP1BPP1/RN1Q1RK1 w - - 0 10",
        "san": "10. Nbd2",
        "instruction": "ม้าคู่ — รอ ...Bg4",
        "expected": {
          "from": "b1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "c8",
          "to": "g4"
        },
        "opponentSan": "10...Bg4"
      }
    ]
  },
  {
    "id": "sicilian-defense",
    "kind": "main",
    "title": "Sicilian Defense",
    "subtitle": "Open Sicilian — สายหลัก",
    "icon": "🐉",
    "eco": "B90",
    "description": "Open Sicilian + English Attack setup",
    "middlegamePlan": "English Attack: f3+e4 ขยายฝั่งคิง, Qd2+Bh6 โจมตีฝั่งคิงคู่",
    "line": "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Nbd7 Qd2 g6 Be2 Bg7 O-O-O O-O g4 b5 h4 a5 a3 b4 h5 g5",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. e4",
        "instruction": "เปิด e4",
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
        "instruction": "Nf3 เตรียม d4",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "d7",
          "to": "d6"
        },
        "opponentSan": "2...d6"
      },
      {
        "fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        "san": "3. d4",
        "instruction": "Open Sicilian!",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "opponentMove": {
          "from": "c5",
          "to": "d4"
        },
        "opponentSan": "3...cxd4"
      },
      {
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
        "san": "4. Nxd4",
        "instruction": "กินด้วยม้า",
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
        "instruction": "พัฒนาม้า c3",
        "expected": {
          "from": "b1",
          "to": "c3"
        },
        "opponentMove": {
          "from": "a7",
          "to": "a6"
        },
        "opponentSan": "5...a6"
      },
      {
        "fen": "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        "san": "6. Be3",
        "instruction": "English Attack setup",
        "expected": {
          "from": "c1",
          "to": "e3"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e5"
        },
        "opponentSan": "6...e5"
      },
      {
        "fen": "rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7",
        "san": "7. Nb3",
        "instruction": "ถอยม้า b3",
        "expected": {
          "from": "d4",
          "to": "b3"
        },
        "opponentMove": {
          "from": "c8",
          "to": "e6"
        },
        "opponentSan": "7...Be6"
      },
      {
        "fen": "rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R w KQkq - 2 8",
        "san": "8. f3",
        "instruction": "f3 รองรับ e4",
        "expected": {
          "from": "f2",
          "to": "f3"
        },
        "opponentMove": {
          "from": "b8",
          "to": "d7"
        },
        "opponentSan": "8...Nbd7"
      },
      {
        "fen": "r2qkb1r/1p1n1ppp/p2pbn2/4p3/4P3/1NN1BP2/PPP3PP/R2QKB1R w KQkq - 1 9",
        "san": "9. Qd2",
        "instruction": "Qd2 เชื่อมเรือ",
        "expected": {
          "from": "d1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "g7",
          "to": "g6"
        },
        "opponentSan": "9...g6"
      },
      {
        "fen": "r2qkb1r/1p1n1p1p/p2pbnp1/4p3/4P3/1NN1BP2/PPPQ2PP/R3KB1R w KQkq - 0 10",
        "san": "10. Be2",
        "instruction": "Be2",
        "expected": {
          "from": "f1",
          "to": "e2"
        },
        "opponentMove": {
          "from": "f8",
          "to": "g7"
        },
        "opponentSan": "10...Bg7"
      },
      {
        "fen": "r2qk2r/1p1n1pbp/p2pbnp1/4p3/4P3/1NN1BP2/PPPQB1PP/R3K2R w KQkq - 2 11",
        "san": "11. O-O-O",
        "instruction": "Castling ฝั่งควีน",
        "expected": {
          "from": "e1",
          "to": "c1"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "11...O-O"
      },
      {
        "fen": "r2q1rk1/1p1n1pbp/p2pbnp1/4p3/4P3/1NN1BP2/PPPQB1PP/2KR3R w - - 4 12",
        "san": "12. g4",
        "instruction": "g4! ขยายฝั่งคิง",
        "expected": {
          "from": "g2",
          "to": "g4"
        },
        "opponentMove": {
          "from": "b7",
          "to": "b5"
        },
        "opponentSan": "12...b5"
      },
      {
        "fen": "r2q1rk1/3n1pbp/p2pbnp1/1p2p3/4P1P1/1NN1BP2/PPPQB2P/2KR3R w - - 0 13",
        "san": "13. h4",
        "instruction": "h4 รองรับ g5",
        "expected": {
          "from": "h2",
          "to": "h4"
        },
        "opponentMove": {
          "from": "a6",
          "to": "a5"
        },
        "opponentSan": "13...a5"
      },
      {
        "fen": "r2q1rk1/3n1pbp/3pbnp1/pp2p3/4P1PP/1NN1BP2/PPPQB3/2KR3R w - - 0 14",
        "san": "14. a3",
        "instruction": "a3 รองรับ b4",
        "expected": {
          "from": "a2",
          "to": "a3"
        },
        "opponentMove": {
          "from": "b5",
          "to": "b4"
        },
        "opponentSan": "14...b4"
      },
      {
        "fen": "r2q1rk1/3n1pbp/3pbnp1/p3p3/1p2P1PP/PNN1BP2/1PPQB3/2KR3R w - - 0 15",
        "san": "15. h5",
        "instruction": "h5 กดดันฝั่งคิง",
        "expected": {
          "from": "h4",
          "to": "h5"
        },
        "opponentMove": {
          "from": "g6",
          "to": "g5"
        },
        "opponentSan": "15...g5"
      }
    ]
  },
  {
    "id": "sicilian-najdorf",
    "kind": "variation",
    "title": "Sicilian Defense",
    "subtitle": "สายรอง: Najdorf (5...a6)",
    "icon": "🐉",
    "eco": "B90",
    "description": "Najdorf — สายรองที่แข็งแกร่งที่สุดของ Sicilian",
    "middlegamePlan": "Najdorf: a6 รองรับ b5 — เป้าหมาย e5/f4-f5 ขยายฝั่งคิง",
    "line": "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Be7 Qd2 Nbd7 Be2 O-O O-O-O Qc7 g4 b5 h4 a5 a3 b4 h5 bxa3",
    "steps": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "1. e4",
        "instruction": "เปิด e4",
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
        "instruction": "Nf3",
        "expected": {
          "from": "g1",
          "to": "f3"
        },
        "opponentMove": {
          "from": "d7",
          "to": "d6"
        },
        "opponentSan": "2...d6"
      },
      {
        "fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        "san": "3. d4",
        "instruction": "Open Sicilian",
        "expected": {
          "from": "d2",
          "to": "d4"
        },
        "opponentMove": {
          "from": "c5",
          "to": "d4"
        },
        "opponentSan": "3...cxd4"
      },
      {
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
        "san": "4. Nxd4",
        "instruction": "กินเบี้ย",
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
        "instruction": "Najdorf! รอ ...a6",
        "expected": {
          "from": "b1",
          "to": "c3"
        },
        "opponentMove": {
          "from": "a7",
          "to": "a6"
        },
        "opponentSan": "5...a6"
      },
      {
        "fen": "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        "san": "6. Be3",
        "instruction": "English Attack",
        "expected": {
          "from": "c1",
          "to": "e3"
        },
        "opponentMove": {
          "from": "e7",
          "to": "e5"
        },
        "opponentSan": "6...e5"
      },
      {
        "fen": "rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7",
        "san": "7. Nb3",
        "instruction": "ถอยม้า",
        "expected": {
          "from": "d4",
          "to": "b3"
        },
        "opponentMove": {
          "from": "c8",
          "to": "e6"
        },
        "opponentSan": "7...Be6"
      },
      {
        "fen": "rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R w KQkq - 2 8",
        "san": "8. f3",
        "instruction": "f3",
        "expected": {
          "from": "f2",
          "to": "f3"
        },
        "opponentMove": {
          "from": "f8",
          "to": "e7"
        },
        "opponentSan": "8...Be7"
      },
      {
        "fen": "rn1qk2r/1p2bppp/p2pbn2/4p3/4P3/1NN1BP2/PPP3PP/R2QKB1R w KQkq - 1 9",
        "san": "9. Qd2",
        "instruction": "Qd2",
        "expected": {
          "from": "d1",
          "to": "d2"
        },
        "opponentMove": {
          "from": "b8",
          "to": "d7"
        },
        "opponentSan": "9...Nbd7"
      },
      {
        "fen": "r2qk2r/1p1nbppp/p2pbn2/4p3/4P3/1NN1BP2/PPPQ2PP/R3KB1R w KQkq - 3 10",
        "san": "10. Be2",
        "instruction": "Be2",
        "expected": {
          "from": "f1",
          "to": "e2"
        },
        "opponentMove": {
          "from": "e8",
          "to": "g8"
        },
        "opponentSan": "10...O-O"
      },
      {
        "fen": "r2q1rk1/1p1nbppp/p2pbn2/4p3/4P3/1NN1BP2/PPPQB1PP/R3K2R w KQ - 5 11",
        "san": "11. O-O-O",
        "instruction": "Castling ฝั่งควีน",
        "expected": {
          "from": "e1",
          "to": "c1"
        },
        "opponentMove": {
          "from": "d8",
          "to": "c7"
        },
        "opponentSan": "11...Qc7"
      },
      {
        "fen": "r4rk1/1pqnbppp/p2pbn2/4p3/4P3/1NN1BP2/PPPQB1PP/2KR3R w - - 7 12",
        "san": "12. g4",
        "instruction": "g4! ขยายฝั่งคิง",
        "expected": {
          "from": "g2",
          "to": "g4"
        },
        "opponentMove": {
          "from": "b7",
          "to": "b5"
        },
        "opponentSan": "12...b5"
      },
      {
        "fen": "r4rk1/2qnbppp/p2pbn2/1p2p3/4P1P1/1NN1BP2/PPPQB2P/2KR3R w - - 0 13",
        "san": "13. h4",
        "instruction": "h4",
        "expected": {
          "from": "h2",
          "to": "h4"
        },
        "opponentMove": {
          "from": "a6",
          "to": "a5"
        },
        "opponentSan": "13...a5"
      },
      {
        "fen": "r4rk1/2qnbppp/3pbn2/pp2p3/4P1PP/1NN1BP2/PPPQB3/2KR3R w - - 0 14",
        "san": "14. a3",
        "instruction": "a3",
        "expected": {
          "from": "a2",
          "to": "a3"
        },
        "opponentMove": {
          "from": "b5",
          "to": "b4"
        },
        "opponentSan": "14...b4"
      },
      {
        "fen": "r4rk1/2qnbppp/3pbn2/p3p3/1p2P1PP/PNN1BP2/1PPQB3/2KR3R w - - 0 15",
        "san": "15. h5",
        "instruction": "h5 — กดดันฝั่งคิง",
        "expected": {
          "from": "h4",
          "to": "h5"
        },
        "opponentMove": {
          "from": "b4",
          "to": "a3"
        },
        "opponentSan": "15...bxa3"
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
