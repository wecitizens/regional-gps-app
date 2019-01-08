SELECT
    a.id,
    CONCAT('2018_be_municipal_be_', j.postcode) AS segment_key,
    'candidate' AS segment_type,
    CONCAT('be_politician_',a.id_politician) AS user_key,
    CONCAT('question_', a.opinion_id) AS question_key,
    CASE
    WHEN a.opinion_answer = 5 THEN 'fully_agree'
    WHEN a.opinion_answer = 4 THEN 'agree'
    WHEN a.opinion_answer = 3 THEN 'no_opinion'
    WHEN a.opinion_answer = 2 THEN 'disagree'
    WHEN a.opinion_answer = 1 THEN 'fully_disagree'
    ELSE 'no_opinion'
    END AS value
FROM
    opinions_answers a
    JOIN
    politician_job j ON j.id_politician = a.id_politician
WHERE
    opinion_received > '2018-09-08'
    AND j.num = 1
    AND a.id_politician != 5439 # Jean-Paul
ORDER BY opinion_received DESC