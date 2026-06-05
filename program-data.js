// Program plan data — edit this file to update the workout schedule, videos, tennis days, etc.
// The content between the braces is plain JSON; just keep the `const PROGRAM_DATA = ` prefix
// and the trailing semicolon so the browser can load it via <script src>.
const PROGRAM_DATA =
{
  "program": {
    "startDate": "2026-06-07",
    "totalDays": 30,
    "restDayWeekdays": [0, 2, 5, 6],
    "tennisWeekdays": [0, 2],
    "restDayActivity": "Tennis",
    "warmupMins": 2,
    "cooldownMinsByPhase": {"1": 2, "2": 3, "3": 3, "4": 4}
  },

  "phases": {
    "1": {"name": "Foundation", "tagColor": "var(--sage-dark)", "barColor": "var(--sage)", "dotColor": "var(--sage)", "totalDays": 8, "timeRange": "10–12 min"},
    "2": {"name": "Build",      "tagColor": "#3A6D8C",         "barColor": "#5B8DA6",     "dotColor": "#5B8DA6",     "totalDays": 8, "timeRange": "15–18 min"},
    "3": {"name": "Strength",   "tagColor": "#804060",         "barColor": "#A66080",     "dotColor": "#A66080",     "totalDays": 8, "timeRange": "20–25 min"},
    "4": {"name": "Peak",       "tagColor": "#9A7C28",         "barColor": "var(--gold)", "dotColor": "var(--gold)", "totalDays": 6, "timeRange": "26–30 min"}
  },

  "warmupExercises": [
    {"key": "catcow",  "name": "Cat-Cow Stretch", "detail": "6 slow reps",         "link": "https://www.youtube.com/watch?v=kqnua4rHVVA"},
    {"key": "hipcirc", "name": "Hip Circles",     "detail": "8 each side",         "link": "https://www.youtube.com/watch?v=JYqLwajOGjI"},
    {"key": "armcirc", "name": "Arm Circles",     "detail": "10 forward + 10 back","link": "https://www.youtube.com/watch?v=hne3nHGXPRM"}
  ],

  "cooldownSets": {
    "1": [
      {"key": "childpose", "name": "Child's Pose",              "detail": "Hold 30s",       "link": "https://www.youtube.com/watch?v=2MJGg-dUKh0"},
      {"key": "hipflexor", "name": "Lying Hip Flexor Stretch",  "detail": "30s each side",  "link": "https://www.youtube.com/watch?v=kygaoNgd3Xk"},
      {"key": "chestopen", "name": "Chest Opener Stretch",      "detail": "Hold 30s",       "link": "https://www.youtube.com/watch?v=AzqdRXuDGbY"}
    ],
    "2": [
      {"key": "pigeon",    "name": "Pigeon Pose",               "detail": "40s each side",  "link": "https://www.youtube.com/watch?v=JGEHLp-Bhzc"},
      {"key": "tricepstr", "name": "Overhead Tricep Stretch",   "detail": "30s each arm",   "link": "https://www.youtube.com/watch?v=NQqiIetDahI"},
      {"key": "cobra",     "name": "Cobra Stretch",             "detail": "Hold 30s",       "link": "https://www.youtube.com/watch?v=YYudWYM5Q9g"}
    ],
    "3": [
      {"key": "figure4",    "name": "Figure-4 Hip Stretch",     "detail": "40s each side",  "link": "https://www.youtube.com/watch?v=VgjgTGnBkx0"},
      {"key": "tricepstr2", "name": "Overhead Tricep Stretch",  "detail": "30s each arm",   "link": "https://www.youtube.com/watch?v=NQqiIetDahI"},
      {"key": "catcow2",    "name": "Cat-Cow Flow",             "detail": "6 slow reps",    "link": "https://www.youtube.com/watch?v=kqnua4rHVVA"}
    ],
    "4": [
      {"key": "pigeon2",     "name": "Pigeon Pose",             "detail": "45s each side",  "link": "https://www.youtube.com/watch?v=JGEHLp-Bhzc"},
      {"key": "fwdfold",     "name": "Seated Forward Fold",     "detail": "Hold 45s",       "link": "https://www.youtube.com/watch?v=oJX8EKF3TqM"},
      {"key": "doorway",     "name": "Doorway Chest Stretch",   "detail": "Hold 30s",       "link": "https://www.youtube.com/watch?v=WHE7_ilKsy8"},
      {"key": "spinaltwist", "name": "Supine Spinal Twist",     "detail": "30s each side",  "link": "https://www.youtube.com/watch?v=ezyMaQEaVaI"}
    ]
  },

  "watchGuide": {
    "1": {"type": "Functional Strength Training", "steps": "On Apple Watch → Workout app → scroll to \"Functional Strength Training\" → tap Start", "tip": "Phase 1 uses bodyweight & low-load moves. Functional Strength gives the most accurate calorie burn for this type."},
    "2": {"type": "Functional Strength Training", "steps": "Apple Watch → Workout → \"Functional Strength Training\". As intensity builds, your HR zone will push into Zone 2–3.", "tip": "If HR stays in Zone 3+ for most of the session, you can also log as \"Core Training\" for variety."},
    "3": {"type": "Core Training", "steps": "Apple Watch → Workout → scroll to \"Core Training\" → Start. Alternatively use \"Functional Strength Training\".", "tip": "Phase 3 has sustained plank holds & HIIT-style moves. Core Training or Functional Strength both work — Core Training tracks HR more aggressively."},
    "4": {"type": "Core Training", "steps": "Apple Watch → Workout → \"Core Training\" → Start. At peak intensity you may prefer \"HIIT\" if HR stays above 75% max.", "tip": "Peak days push into Zone 3–4. If a session feels like a full circuit, select HIIT for better calorie tracking."}
  },

  "exercises": {
    "deadBug":            {"name": "Dead Bug",                       "target": "Deep core, APT correction",      "tip": "Press lower back into mat the entire time. Move slowly.",                  "link": "https://www.youtube.com/watch?v=g_BYB0R-4Ws"},
    "pelvicTilt":         {"name": "Supine Pelvic Tilt",             "target": "Lower abs, APT correction",      "tip": "Flatten lower back to mat by squeezing glutes and drawing navel in.",      "link": "https://www.youtube.com/watch?v=U0dfnyfhpwk"},
    "gluteBridge":        {"name": "Glute Bridge",                   "target": "Glutes, hamstrings, APT",        "tip": "Squeeze glutes at the top. Don't hyperextend lower back.",                 "link": "https://www.youtube.com/watch?v=OUgsJ8-Vi0E"},
    "birdDog":            {"name": "Bird Dog",                       "target": "Core stability, lower back, APT","tip": "Keep hips level — don't rotate as you extend opposite arm/leg.",            "link": "https://www.youtube.com/watch?v=wiFNA3sqjCA"},
    "hollowBodyHold":     {"name": "Hollow Body Hold",               "target": "Deep core, abs, APT",            "tip": "Lower back stays on mat. Lower legs only as far as you can without arching.","link": "https://www.youtube.com/watch?v=LlDNef_Ztsc"},
    "modifiedPlank":      {"name": "Modified Plank (Knees)",         "target": "Core, shoulders, APT",           "tip": "Straight line from knees to head. Engage abs — don't sag.",                "link": "https://www.youtube.com/watch?v=IODxDxX7oi4"},
    "fullPlank":          {"name": "Full Plank Hold",                "target": "Full core, APT stabilization",   "tip": "Tuck pelvis slightly and pull navel to spine.",                            "link": "https://www.youtube.com/watch?v=pSHjTRCQxIw"},
    "reverseCrunch":      {"name": "Reverse Crunch",                 "target": "Lower abs, APT correction",      "tip": "Curl hips up using lower abs — no momentum.",                              "link": "https://www.youtube.com/watch?v=XY8KzdDcMFg"},
    "legRaiseBent":       {"name": "Bent Knee Leg Raise",            "target": "Lower abs, hip flexors",         "tip": "Keep lower back pressed to mat. Raise and lower with control.",            "link": "https://www.youtube.com/watch?v=l4kQd9eWclE"},
    "mountainClimber":    {"name": "Slow Mountain Climbers",         "target": "Core, cardio, total body",       "tip": "Slow and deliberate — feel core engage with each knee drive.",             "link": "https://www.youtube.com/watch?v=nmwgirgXLYM"},
    "sidePlank":          {"name": "Side Plank (Modified)",          "target": "Obliques, lateral core",         "tip": "Stack hips — don't drop them. Hold from knees if needed.",                 "link": "https://www.youtube.com/watch?v=K-CrEi0ymMg"},
    "hipThrust":          {"name": "Hip Thrust (Floor)",             "target": "Glutes, APT correction",         "tip": "Drive through heels. Squeeze glutes at top for 1 second.",                 "link": "https://www.youtube.com/watch?v=xDmFkJxPzeM"},
    "innerThighSqueezeB": {"name": "Lying Inner Thigh Squeeze",      "target": "Inner thighs (adductors)",       "tip": "Use a pillow or fist between knees. Squeeze and hold 3 sec.",              "link": "https://www.youtube.com/watch?v=DInNYxQ6wFk"},
    "sumoSquat":          {"name": "Sumo Squat",                     "target": "Inner thighs, glutes, quads",    "tip": "Toes out 45°, knees track over toes. Sit deep.",                           "link": "https://www.youtube.com/watch?v=kjlfpqXnyL8"},
    "innerThighLift":     {"name": "Side-Lying Inner Thigh Lift",    "target": "Inner thighs (adductors)",       "tip": "Bottom leg lifts. Foot flexed. Don't let hip roll back.",                  "link": "https://www.youtube.com/watch?v=LknNaxKPOEQ"},
    "plateSumoSquat":     {"name": "Sumo Squat Pulse",               "target": "Inner thighs, glutes",           "tip": "Hold the bottom position, pulse 1 inch up and down.",                      "link": "https://www.youtube.com/watch?v=kjlfpqXnyL8"},
    "lateralLunge":       {"name": "Lateral Lunge",                  "target": "Inner thighs, glutes",           "tip": "Push hips back, chest up. Straight leg feels the stretch.",                "link": "https://www.youtube.com/watch?v=gwWv7aPcD88"},
    "bicepCurl":          {"name": "Bicep Curl (1kg)",               "target": "Biceps, forearms",               "tip": "Slow and controlled. Squeeze at top, lower in 3 counts.",                  "link": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"},
    "overheadPress":      {"name": "Overhead Shoulder Press (1kg)",  "target": "Shoulders, triceps",             "tip": "Core tight, don't arch back. Press straight up.",                          "link": "https://www.youtube.com/watch?v=qEwKCR5JCog"},
    "tricepKickback":     {"name": "Tricep Kickback (1kg)",          "target": "Triceps (arm toning)",           "tip": "Upper arm parallel to floor. Extend fully, squeeze tricep.",               "link": "https://www.youtube.com/watch?v=6SS6K3lAwZ8"},
    "lateralRaise":       {"name": "Lateral Raise (1kg)",            "target": "Shoulders, upper arms",          "tip": "Slight elbow bend, raise to shoulder height. Slow descent.",               "link": "https://www.youtube.com/watch?v=3VcKaXpzqRo"},
    "wallPushUp":         {"name": "Wall Push-Up",                   "target": "Chest, triceps, shoulders",      "tip": "Straight body line. Lower chest to wall, push back.",                      "link": "https://www.youtube.com/watch?v=QpMTk21EmaM"},
    "kneePushUp":         {"name": "Knee Push-Up",                   "target": "Chest, triceps, arms",           "tip": "Core engaged. Lower chest between hands, not face.",                       "link": "https://www.youtube.com/watch?v=jWxvty2KROs"},
    "frontRaise":         {"name": "Front Raise (1kg)",              "target": "Front deltoids, arms",           "tip": "Arms straight, raise to shoulder height. Control down.",                   "link": "https://www.youtube.com/watch?v=FJdYqsoFZCE"},
    "tricepOverhead":     {"name": "Overhead Tricep Extension (1kg)","target": "Triceps",                        "tip": "Hold dumbbell with both hands overhead. Lower behind head, elbows in.",    "link": "https://www.youtube.com/watch?v=YbX7Wd8jQ-Q"},
    "hammerCurl":         {"name": "Hammer Curl (1kg)",              "target": "Biceps, forearms",               "tip": "Thumbs-up grip. Controlled curl and descent.",                             "link": "https://www.youtube.com/watch?v=zC3nLlEvin4"}
  },

  "tennisWarmup": [
    {"key": "tw_jog",           "name": "Light Jog in Place",            "detail": "60 seconds",                              "link": "https://www.youtube.com/watch?v=xmkYBO85leM", "tip": "Gets blood flowing to legs before clay court movement."},
    {"key": "tw_legswing",      "name": "Leg Swings (Front & Side)",     "detail": "10 each leg, each direction",             "link": "https://www.youtube.com/watch?v=difYoBtZi2s", "tip": "Opens hip flexors — essential for clay court lateral movement."},
    {"key": "tw_hiprot",        "name": "Hip Rotation Stretch",          "detail": "8 circles each direction",                "link": "https://www.youtube.com/watch?v=JYqLwajOGjI", "tip": "Primes the hips for the explosive rotational demands of clay."},
    {"key": "tw_shoulderroll",  "name": "Shoulder Rolls & Arm Cross",    "detail": "10 forward, 10 back, 20s cross stretch",  "link": "https://www.youtube.com/watch?v=hne3nHGXPRM", "tip": "Warms up serving and forehand/backhand shoulder muscles."},
    {"key": "tw_anklecirc",     "name": "Ankle Circles & Calf Raise",    "detail": "10 each ankle + 15 calf raises",          "link": "https://www.youtube.com/watch?v=om1IAdzpKsg", "tip": "Clay is slippery — ankle stability is critical before stepping on court."},
    {"key": "tw_lateralstep",   "name": "Lateral Side Steps",            "detail": "10 each side — wide stance",              "link": "https://www.youtube.com/watch?v=L9FzqnlmjCE", "tip": "Mimics clay court footwork. Wide stance, stay low."}
  ],

  "tennisStretches": [
    {"key": "ts_quad",      "name": "Standing Quad Stretch",         "detail": "30s each leg",  "link": "https://www.youtube.com/watch?v=kzAsm4WQqvQ", "tip": "Clay play is hard on quads from low stances — stretch immediately after."},
    {"key": "ts_calf",      "name": "Calf Stretch (Wall)",           "detail": "30s each leg",  "link": "https://www.youtube.com/watch?v=_QWfhbIioy8", "tip": "Prevents tightness from explosive clay court starts and stops."},
    {"key": "ts_hip",       "name": "Pigeon Pose Hip Stretch",       "detail": "40s each side", "link": "https://www.youtube.com/watch?v=JGEHLp-Bhzc", "tip": "Releases hip flexors after all that lateral movement."},
    {"key": "ts_shoulder",  "name": "Cross-Body Shoulder Stretch",   "detail": "30s each arm",  "link": "https://www.youtube.com/watch?v=Pg0JvLSfWwM", "tip": "Cool down the serving shoulder to prevent rotator cuff tightness."},
    {"key": "ts_hamstring", "name": "Seated Hamstring Stretch",      "detail": "40s each leg",  "link": "https://www.youtube.com/watch?v=oJX8EKF3TqM", "tip": "Hamstrings take a beating on clay — long hold here."},
    {"key": "ts_spinal",    "name": "Supine Spinal Twist",           "detail": "30s each side", "link": "https://www.youtube.com/watch?v=ezyMaQEaVaI", "tip": "Decompresses the spine after serving and ground-stroke rotation."}
  ],

  "focusAreas": {
    "Core & Abs":    {"color": "#C4714A", "exerciseKeys": ["deadBug","pelvicTilt","hollowBodyHold","reverseCrunch","fullPlank","modifiedPlank","mountainClimber","sidePlank","legRaiseBent"]},
    "APT Fix":       {"color": "#5C7358", "exerciseKeys": ["pelvicTilt","gluteBridge","birdDog","hipThrust","deadBug","hollowBodyHold"]},
    "Arm Toning":    {"color": "#5B8DA6", "exerciseKeys": ["bicepCurl","overheadPress","tricepKickback","lateralRaise","wallPushUp","kneePushUp","frontRaise","tricepOverhead","hammerCurl"]},
    "Inner Thighs":  {"color": "#A66080", "exerciseKeys": ["innerThighSqueezeB","sumoSquat","innerThighLift","plateSumoSquat","lateralLunge"]}
  },

  "workouts": [
    {"day": 1,  "phase": 1, "workoutMins": 6,  "focus": ["Core Activation","APT Introduction"], "exercises": [
      {"ex": "pelvicTilt",         "reps": "10 × 2 sets, 3s hold"},
      {"ex": "gluteBridge",        "reps": "12 × 2 sets"},
      {"ex": "deadBug",            "reps": "6 each side × 1 set"},
      {"ex": "innerThighSqueezeB", "reps": "12 × 2 sets, 3s hold"},
      {"ex": "bicepCurl",          "reps": "12 × 1 set"}
    ]},
    {"day": 2,  "phase": 1, "workoutMins": 6,  "focus": ["Lower Abs","Arms Intro"], "exercises": [
      {"ex": "pelvicTilt",     "reps": "12 × 2 sets"},
      {"ex": "legRaiseBent",   "reps": "10 × 2 sets"},
      {"ex": "birdDog",        "reps": "8 each side × 1 set"},
      {"ex": "wallPushUp",     "reps": "10 × 2 sets"},
      {"ex": "tricepKickback", "reps": "10 × 1 set"}
    ]},
    {"day": 3,  "phase": 1, "workoutMins": 7,  "focus": ["Glutes","Inner Thighs"], "exercises": [
      {"ex": "gluteBridge",    "reps": "15 × 2 sets"},
      {"ex": "sumoSquat",      "reps": "12 × 2 sets"},
      {"ex": "innerThighLift", "reps": "12 each × 1 set"},
      {"ex": "deadBug",        "reps": "8 each × 1 set"},
      {"ex": "overheadPress",  "reps": "10 × 1 set"}
    ]},
    {"day": 4,  "phase": 1, "workoutMins": 7,  "focus": ["Core Stability","Arms"], "exercises": [
      {"ex": "modifiedPlank",  "reps": "20s × 2 sets"},
      {"ex": "birdDog",        "reps": "10 each × 1 set"},
      {"ex": "reverseCrunch",  "reps": "10 × 2 sets"},
      {"ex": "bicepCurl",      "reps": "12 × 2 sets"},
      {"ex": "lateralRaise",   "reps": "10 × 1 set"}
    ]},
    {"day": 5,  "phase": 1, "workoutMins": 7,  "focus": ["Full Lower Body","APT"], "exercises": [
      {"ex": "pelvicTilt",     "reps": "15 × 2 sets"},
      {"ex": "hipThrust",      "reps": "12 × 2 sets"},
      {"ex": "sumoSquat",      "reps": "15 × 2 sets"},
      {"ex": "innerThighLift", "reps": "15 each × 1 set"},
      {"ex": "tricepKickback", "reps": "12 × 1 set"}
    ]},
    {"day": 6,  "phase": 1, "workoutMins": 8,  "focus": ["Core + Arms Circuit"], "exercises": [
      {"ex": "deadBug",            "reps": "10 each × 2 sets"},
      {"ex": "modifiedPlank",      "reps": "25s × 2 sets"},
      {"ex": "wallPushUp",         "reps": "12 × 2 sets"},
      {"ex": "tricepOverhead",     "reps": "10 × 2 sets"},
      {"ex": "innerThighSqueezeB", "reps": "15 × 2 sets"}
    ]},
    {"day": 7,  "phase": 1, "workoutMins": 8,  "focus": ["Active Recovery","Full Body"], "exercises": [
      {"ex": "gluteBridge",  "reps": "15 × 2 sets"},
      {"ex": "birdDog",      "reps": "10 each × 2 sets"},
      {"ex": "legRaiseBent", "reps": "12 × 2 sets"},
      {"ex": "bicepCurl",    "reps": "15 × 1 set"},
      {"ex": "lateralRaise", "reps": "12 × 1 set"}
    ]},
    {"day": 8,  "phase": 1, "workoutMins": 8,  "focus": ["Phase 1 Consolidation"], "exercises": [
      {"ex": "pelvicTilt",     "reps": "15 × 2 sets"},
      {"ex": "hollowBodyHold", "reps": "15s × 2 sets"},
      {"ex": "sumoSquat",      "reps": "15 × 2 sets"},
      {"ex": "kneePushUp",     "reps": "8 × 2 sets"},
      {"ex": "innerThighLift", "reps": "15 each × 1 set"}
    ]},
    {"day": 9,  "phase": 2, "workoutMins": 10, "focus": ["Core Endurance","APT Deepening"], "exercises": [
      {"ex": "hollowBodyHold", "reps": "20s × 3 sets"},
      {"ex": "deadBug",        "reps": "12 each × 3 sets"},
      {"ex": "reverseCrunch",  "reps": "12 × 3 sets"},
      {"ex": "gluteBridge",    "reps": "15 × 3 sets, 2s hold"},
      {"ex": "bicepCurl",      "reps": "15 × 2 sets"}
    ]},
    {"day": 10, "phase": 2, "workoutMins": 11, "focus": ["Inner Thighs","Triceps"], "exercises": [
      {"ex": "sumoSquat",      "reps": "15 × 3 sets"},
      {"ex": "plateSumoSquat", "reps": "20 pulses × 3 sets"},
      {"ex": "innerThighLift", "reps": "15 each × 3 sets"},
      {"ex": "tricepKickback", "reps": "15 × 3 sets"},
      {"ex": "tricepOverhead", "reps": "12 × 2 sets"}
    ]},
    {"day": 11, "phase": 2, "workoutMins": 11, "focus": ["Plank Progressions","Shoulders"], "exercises": [
      {"ex": "fullPlank",       "reps": "25s × 3 sets"},
      {"ex": "sidePlank",       "reps": "20s each × 3 sets"},
      {"ex": "mountainClimber", "reps": "20 × 3 sets (slow)"},
      {"ex": "overheadPress",   "reps": "15 × 3 sets"},
      {"ex": "lateralRaise",    "reps": "12 × 2 sets"}
    ]},
    {"day": 12, "phase": 2, "workoutMins": 11, "focus": ["Glute & Thigh Focus"], "exercises": [
      {"ex": "hipThrust",          "reps": "15 × 3 sets, 1s hold"},
      {"ex": "lateralLunge",       "reps": "12 each × 3 sets"},
      {"ex": "innerThighSqueezeB", "reps": "15 × 3 sets, 5s hold"},
      {"ex": "reverseCrunch",      "reps": "15 × 3 sets"},
      {"ex": "kneePushUp",         "reps": "10 × 3 sets"}
    ]},
    {"day": 13, "phase": 2, "workoutMins": 12, "focus": ["Core Circuit"], "exercises": [
      {"ex": "deadBug",         "reps": "12 each × 2 sets"},
      {"ex": "hollowBodyHold",  "reps": "25s × 2 sets"},
      {"ex": "birdDog",         "reps": "12 each × 2 sets"},
      {"ex": "mountainClimber", "reps": "25 slow × 2 sets"},
      {"ex": "frontRaise",      "reps": "12 × 2 sets"}
    ]},
    {"day": 14, "phase": 2, "workoutMins": 12, "focus": ["Arms + Thighs Superset"], "exercises": [
      {"ex": "bicepCurl",      "reps": "15 × 3 sets"},
      {"ex": "sumoSquat",      "reps": "15 × 3 sets"},
      {"ex": "tricepKickback", "reps": "15 × 3 sets"},
      {"ex": "innerThighLift", "reps": "15 each × 2 sets"},
      {"ex": "gluteBridge",    "reps": "15 × 2 sets"}
    ]},
    {"day": 15, "phase": 2, "workoutMins": 12, "focus": ["Full Core + APT"], "exercises": [
      {"ex": "pelvicTilt", "reps": "15 × 3 sets"},
      {"ex": "fullPlank",  "reps": "30s × 3 sets"},
      {"ex": "sidePlank",  "reps": "25s each × 2 sets"},
      {"ex": "hipThrust",  "reps": "18 × 2 sets"},
      {"ex": "hammerCurl", "reps": "12 × 2 sets"}
    ]},
    {"day": 16, "phase": 2, "workoutMins": 13, "focus": ["Phase 2 Peak"], "exercises": [
      {"ex": "deadBug",        "reps": "15 each × 2 sets"},
      {"ex": "reverseCrunch",  "reps": "15 × 3 sets"},
      {"ex": "lateralLunge",   "reps": "15 each × 2 sets"},
      {"ex": "kneePushUp",     "reps": "12 × 3 sets"},
      {"ex": "tricepOverhead", "reps": "15 × 2 sets"}
    ]},
    {"day": 17, "phase": 3, "workoutMins": 15, "focus": ["Strength Foundation"], "exercises": [
      {"ex": "hollowBodyHold", "reps": "30s × 3 sets"},
      {"ex": "hipThrust",      "reps": "20 × 3 sets, 2s hold"},
      {"ex": "sumoSquat",      "reps": "20 × 3 sets"},
      {"ex": "overheadPress",  "reps": "18 × 3 sets"},
      {"ex": "sidePlank",      "reps": "30s each × 3 sets"}
    ]},
    {"day": 18, "phase": 3, "workoutMins": 16, "focus": ["Core Intensity"], "exercises": [
      {"ex": "fullPlank",       "reps": "45s × 3 sets"},
      {"ex": "mountainClimber", "reps": "30 × 3 sets"},
      {"ex": "deadBug",         "reps": "15 each × 3 sets"},
      {"ex": "reverseCrunch",   "reps": "18 × 3 sets"},
      {"ex": "bicepCurl",       "reps": "20 × 3 sets"}
    ]},
    {"day": 19, "phase": 3, "workoutMins": 16, "focus": ["Thighs & Glutes Strength"], "exercises": [
      {"ex": "plateSumoSquat", "reps": "30 pulses × 3 sets"},
      {"ex": "innerThighLift", "reps": "20 each × 3 sets"},
      {"ex": "lateralLunge",   "reps": "15 each × 3 sets"},
      {"ex": "gluteBridge",    "reps": "20 × 3 sets, 3s hold"},
      {"ex": "tricepKickback", "reps": "20 × 3 sets"}
    ]},
    {"day": 20, "phase": 3, "workoutMins": 17, "focus": ["Arms & Shoulders Strength"], "exercises": [
      {"ex": "kneePushUp",     "reps": "15 × 3 sets"},
      {"ex": "bicepCurl",      "reps": "20 × 3 sets"},
      {"ex": "lateralRaise",   "reps": "15 × 3 sets"},
      {"ex": "tricepOverhead", "reps": "15 × 3 sets"},
      {"ex": "frontRaise",     "reps": "15 × 3 sets"},
      {"ex": "hollowBodyHold", "reps": "30s × 3 sets"}
    ]},
    {"day": 21, "phase": 3, "workoutMins": 17, "focus": ["Full Body Circuit A"], "exercises": [
      {"ex": "fullPlank",          "reps": "45s × 3 sets"},
      {"ex": "hipThrust",          "reps": "20 × 3 sets"},
      {"ex": "innerThighSqueezeB", "reps": "20 × 3 sets, 5s hold"},
      {"ex": "overheadPress",      "reps": "18 × 3 sets"},
      {"ex": "mountainClimber",    "reps": "30 × 3 sets"}
    ]},
    {"day": 22, "phase": 3, "workoutMins": 18, "focus": ["APT & Core Power"], "exercises": [
      {"ex": "pelvicTilt", "reps": "20 × 3 sets"},
      {"ex": "deadBug",    "reps": "15 each × 3 sets"},
      {"ex": "birdDog",    "reps": "15 each × 3 sets"},
      {"ex": "sidePlank",  "reps": "35s each × 3 sets"},
      {"ex": "sumoSquat",  "reps": "20 × 3 sets"},
      {"ex": "hammerCurl", "reps": "15 × 3 sets"}
    ]},
    {"day": 23, "phase": 3, "workoutMins": 19, "focus": ["Full Body Circuit B"], "exercises": [
      {"ex": "kneePushUp",     "reps": "15 × 3 sets"},
      {"ex": "lateralLunge",   "reps": "15 each × 3 sets"},
      {"ex": "reverseCrunch",  "reps": "20 × 3 sets"},
      {"ex": "tricepKickback", "reps": "20 × 3 sets"},
      {"ex": "innerThighLift", "reps": "20 each × 3 sets"},
      {"ex": "gluteBridge",    "reps": "20 × 3 sets"}
    ]},
    {"day": 24, "phase": 3, "workoutMins": 20, "focus": ["Phase 3 Peak"], "exercises": [
      {"ex": "fullPlank",       "reps": "50s × 3 sets"},
      {"ex": "hollowBodyHold",  "reps": "35s × 3 sets"},
      {"ex": "hipThrust",       "reps": "20 × 3 sets, 2s hold"},
      {"ex": "overheadPress",   "reps": "20 × 3 sets"},
      {"ex": "plateSumoSquat",  "reps": "30 pulses × 3 sets"},
      {"ex": "mountainClimber", "reps": "35 × 3 sets"}
    ]},
    {"day": 25, "phase": 4, "workoutMins": 20, "focus": ["Peak Circuit A"], "exercises": [
      {"ex": "fullPlank",      "reps": "50s × 3 sets"},
      {"ex": "deadBug",        "reps": "20 each × 3 sets"},
      {"ex": "sumoSquat",      "reps": "20 × 3 sets"},
      {"ex": "bicepCurl",      "reps": "20 × 3 sets"},
      {"ex": "tricepOverhead", "reps": "20 × 3 sets"},
      {"ex": "innerThighLift", "reps": "20 each × 3 sets"}
    ]},
    {"day": 26, "phase": 4, "workoutMins": 21, "focus": ["Peak APT + Lower Body"], "exercises": [
      {"ex": "pelvicTilt",    "reps": "20 × 3 sets"},
      {"ex": "hipThrust",     "reps": "25 × 3 sets, 2s hold"},
      {"ex": "lateralLunge",  "reps": "20 each × 3 sets"},
      {"ex": "sidePlank",     "reps": "40s each × 3 sets"},
      {"ex": "overheadPress", "reps": "20 × 3 sets"},
      {"ex": "reverseCrunch", "reps": "20 × 3 sets"}
    ]},
    {"day": 27, "phase": 4, "workoutMins": 22, "focus": ["Peak Arms + Core"], "exercises": [
      {"ex": "kneePushUp",         "reps": "15 × 4 sets"},
      {"ex": "tricepKickback",     "reps": "20 × 3 sets"},
      {"ex": "frontRaise",         "reps": "15 × 3 sets"},
      {"ex": "hollowBodyHold",     "reps": "40s × 3 sets"},
      {"ex": "mountainClimber",    "reps": "40 × 3 sets"},
      {"ex": "innerThighSqueezeB", "reps": "20 × 3 sets, 5s hold"}
    ]},
    {"day": 28, "phase": 4, "workoutMins": 22, "focus": ["Peak Full Body Strength"], "exercises": [
      {"ex": "fullPlank",      "reps": "55s × 3 sets"},
      {"ex": "plateSumoSquat", "reps": "30 pulses × 3 sets"},
      {"ex": "deadBug",        "reps": "20 each × 3 sets"},
      {"ex": "hammerCurl",     "reps": "20 × 3 sets"},
      {"ex": "lateralRaise",   "reps": "20 × 3 sets"},
      {"ex": "hipThrust",      "reps": "25 × 3 sets"}
    ]},
    {"day": 29, "phase": 4, "workoutMins": 23, "focus": ["Peak Integration"], "exercises": [
      {"ex": "birdDog",         "reps": "20 each × 3 sets"},
      {"ex": "hipThrust",       "reps": "25 × 3 sets, 3s hold"},
      {"ex": "lateralLunge",    "reps": "20 each × 3 sets"},
      {"ex": "kneePushUp",      "reps": "15 × 4 sets"},
      {"ex": "tricepOverhead",  "reps": "20 × 3 sets"},
      {"ex": "mountainClimber", "reps": "40 × 3 sets"}
    ]},
    {"day": 30, "phase": 4, "workoutMins": 24, "focus": ["Final Day — Full Program"], "exercises": [
      {"ex": "pelvicTilt",     "reps": "20 × 3 sets"},
      {"ex": "fullPlank",      "reps": "60s × 4 sets"},
      {"ex": "deadBug",        "reps": "20 each × 3 sets"},
      {"ex": "hipThrust",      "reps": "25 × 4 sets, 3s hold"},
      {"ex": "sumoSquat",      "reps": "20 × 3 sets"},
      {"ex": "bicepCurl",      "reps": "20 × 3 sets"},
      {"ex": "tricepKickback", "reps": "20 × 3 sets"},
      {"ex": "innerThighLift", "reps": "20 each × 3 sets"}
    ]}
  ]
}
;
