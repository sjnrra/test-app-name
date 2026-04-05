import React from "react";

type HistoryItem = {
    id: string;
    date: string;
    change: string;
};

type MetaSectionProps = {
    title?: string;
    author?: string;
    date?: string;
    history?: HistoryItem[];
};

export default function MetaSection({
    title,
    author,
    date,
    history = [],
}: MetaSectionProps) {
    return (
        <details>
            <summary>meta</summary>

            {title && (
                <>
                    <small className="text-gray-500">タイトル : {title}</small>
                    <br />
                </>
            )}

            {date && (
                <>
                    <small className="text-gray-500">投稿日 : {date}</small>
                    <br />
                </>
            )}

            {author && (
                <>
                    <small className="text-gray-500">投稿者 : {author}</small>
                    <br />
                </>
            )}

            {history.length > 0 && (
                <>
                    <small className="text-gray-500">履歴 :</small>
                    <br />

                    <table>
                        <tbody>
                            <tr className="text-gray-500">
                                <th>No</th>
                                <th>日付</th>
                                <th>変更内容</th>
                            </tr>

                            {history.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.date}</td>
                                    <td>{item.change}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </details>
    );
}